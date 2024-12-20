"use client";
import React, { useState, useEffect } from "react";
import {
  Checkbox,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";

interface Role {
  id: number;
  name: string;
  permissions: string[];
}

interface Permission {
  id: string;
  role_id: number;
  role_name: string;
  permissions: string[];
}

const RoleTable = () => {
  const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

  const [selectedRoleId, setSelectedRoleId] = useState<Role | null>(null);

  const fetchRolesAndPermissions = async () => {
    setIsLoading(true);
    try {
      const [rolesResponse, permissionsResponse] = await Promise.all([
        fetch("http://localhost:3001/roles"),
        fetch("http://localhost:3001/permissions"),
      ]);

      if (!rolesResponse.ok || !permissionsResponse.ok) {
        throw new Error("Failed to fetch roles or permissions");
      }

      const rolesData = await rolesResponse.json();
      const permissionsData = await permissionsResponse.json();

      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      alert("Role name cannot be empty");
      return;
    }

    try {
      const roleResponse = await fetch("http://localhost:3001/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newRoleName,
          id: `${roles.length + 1}`.padStart(3, "0"),
        }),
      });

      if (!roleResponse.ok) {
        throw new Error("Failed to add role");
      }

      const newRole = await roleResponse.json();

      const permissionResponse = await fetch(
        "http://localhost:3001/permissions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: `${permissions.length + 1}`.padStart(3, "0"),
            role_id: newRole.id,
            role_name: newRoleName,
            permissions: ["Read"],
          }),
        }
      );

      if (!permissionResponse.ok) {
        throw new Error("Failed to add permissions");
      }

      await fetchRolesAndPermissions();

      setIsAddRoleModalOpen(false);
      setNewRoleName("");
    } catch (error) {
      console.error("Error adding role:", error);
      alert("Failed to add role");
    }
  };

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const handleDeleteClick = (roleId: Role) => {
    // handleDelete(roleId);
    setSelectedRoleId(roleId);
    onDeleteOpen();
  };

  const printLog = (item: any) => {
    console.log(item);
  };

  const handleDelete = async (roleId: number) => {
    try {
      const roleResponse = await fetch(
        `http://localhost:3001/roles/${roleId}`,
        {
          method: "DELETE",
        }
      );

      if (!roleResponse.ok) {
        console.error("Error deleting role");
        return;
      }

      console.log("Role deleted successfully");
      const permissionsResponse = await fetch(
        `http://localhost:3001/permissions?role_id=${roleId}`,
        {
          method: "GET",
        }
      );

      if (permissionsResponse.ok) {
        const permissions = await permissionsResponse.json();
        await Promise.all(
          permissions.map((permission: { id: string }) =>
            fetch(`http://localhost:3001/permissions/${permission.id}`, {
              method: "DELETE",
            })
          )
        );

        console.log("Associated permissions deleted successfully");
      } else {
        console.error("Error fetching permissions");
      }

      // Refresh roles and permissions
      await fetchRolesAndPermissions();
    } catch (error) {
      console.error("Error:", error);
    }
    onDeleteClose();
    await fetchRolesAndPermissions();
  };

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const handlePermissionToggle = async (
    roleId: any,
    permissionType: string
  ) => {
    try {
      const currentPermissionEntry = permissions.find(
        (p) => p.role_id === roleId
      );

      if (!currentPermissionEntry) {
        console.error(`No permissions found for role ${roleId}`);
        return;
      }

      let newPermissions = [...currentPermissionEntry.permissions];

      if (newPermissions.includes(permissionType)) {
        newPermissions = newPermissions.filter((p) => p !== permissionType);
      } else {
        newPermissions.push(permissionType);
      }

      const updatePayload = {
        ...currentPermissionEntry,
        permissions: newPermissions,
      };

      const response = await fetch(
        `http://localhost:3001/permissions/${currentPermissionEntry.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatePayload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update permissions");
      }

      setPermissions((prevPermissions) =>
        prevPermissions.map((p) =>
          p.id === currentPermissionEntry.id
            ? { ...p, permissions: newPermissions }
            : p
        )
      );
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  const getPermissionsForRole = (roleId: any) => {
    const rolePermission = permissions.find((p) => p.role_id === roleId);
    return {
      read: rolePermission?.permissions.includes("Read") || false,
      write: rolePermission?.permissions.includes("Write") || false,
      edit: rolePermission?.permissions.includes("Edit") || false,
      delete: rolePermission?.permissions.includes("Delete") || false,
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner label="Loading roles..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-6">
        Error loading roles and permissions. Please try again later.
        <button
          onClick={fetchRolesAndPermissions}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-12 gap-4 mb-5">
        <div className="col-span-10">
          <h1 className="font-bold text-3xl">Role management</h1>
          <p className="text-zinc-400">
            Manage roles with specific permissions to ensure proper access
            control.
          </p>
        </div>

        <div className="col-span-2 flex items-center justify-end">
          <button
            className="bg-zinc-900 text-white py-2 px-3 rounded-md hover:bg-gray-700"
            color="primary"
            onClick={() => setIsAddRoleModalOpen(true)}
          >
            + Add new role
          </button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableColumn>ROLE NAME</TableColumn>
          <TableColumn>READ</TableColumn>
          <TableColumn>WRITE</TableColumn>
          <TableColumn>EDIT</TableColumn>
          <TableColumn>DELETE</TableColumn>
          <TableColumn> </TableColumn>
        </TableHeader>
        <TableBody>
          {roles.map((role) => {
            const permissions = getPermissionsForRole(role.id);
            return (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  <Checkbox
                    color="default"
                    isSelected={permissions.read}
                    onValueChange={() =>
                      handlePermissionToggle(role.id, "Read")
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    color="default"
                    isSelected={permissions.write}
                    onValueChange={() =>
                      handlePermissionToggle(role.id, "Write")
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    color="default"
                    isSelected={permissions.edit}
                    onValueChange={() =>
                      handlePermissionToggle(role.id, "Edit")
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    color="default"
                    isSelected={permissions.delete}
                    onValueChange={() =>
                      handlePermissionToggle(role.id, "Delete")
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button
                    onPress={() => handleDeleteClick(role)}
                    color="danger"
                    className="ml-2"
                  >
                    <Image
                      src="/delete.png"
                      height={15}
                      width={15}
                      alt="edit icon"
                      className="invert"
                    />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Modal isOpen={isAddRoleModalOpen} onOpenChange={setIsAddRoleModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add New Role</ModalHeader>
              <ModalBody>
                <Input
                  label="Role Name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Enter role name"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleAddRole}>
                  Add Role
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        backdrop="opaque"
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteClose}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Delete User</ModalHeader>

          <ModalBody>
            <p>Do you want to delete user : {" " + selectedRoleId?.name}</p>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" variant="light" onPress={onDeleteClose}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={
                // () =>printLog(selectedRoleId)
                () =>
                  selectedRoleId?.id !== undefined &&
                  handleDelete(selectedRoleId.id)
              }
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default RoleTable;
