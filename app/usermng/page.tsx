"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
  Switch,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";

const formatPermissions = (permissions: string[]) => {
  const permissionMap: { [key: string]: string } = {
    Read: "R",
    Write: "W",
    Edit: "E",
    Delete: "D",
  };

  return permissions.map((permission) => permissionMap[permission]).join("");
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // add user modal
  const [roles, setRoles] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState(true);

  // Use two separate `useDisclosure` hooks for the modals
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const rowsPerPage = 10;

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:3001/roles");
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles", error);
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const pages = Math.ceil(users.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return users.slice(start, end);
  }, [page, users]);

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    onEditOpen();
  };
  
  const handleDeleteClick = (user: any) => {
    setSelectedUser(user);
    onDeleteOpen();
  };

  const handleAddUserClick = () => {
    onAddOpen();
  };

  const handleDeleteUser = async (userId:any) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        console.log("User deleted successfully");
      } else {
        console.error("Error deleting user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    fetchUsers();
    onDeleteClose();

  };  

  const handleAddUser = async () => {
    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          email,
          role,
          status: status ? "Active" : "Inactive",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      const newUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, newUser]);
      onAddClose();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const tooltipText = (
    <>
      R-READ
      <br />
      W-WRITE
      <br />
      E-EDIT
      <br />
      D-DELETE
    </>
  );

  return (
    <section>
      <div className="grid grid-cols-12 gap-4 mb-5">
        <div className="col-span-10">
          <h1 className="font-bold text-3xl">User management</h1>
          <p className="text-zinc-400">Manage users and their role here.</p>
        </div>

        <div className="col-span-2 flex items-center justify-end">
          <button
            onClick={handleAddUserClick}
            className="bg-zinc-900 text-white py-2 px-3 rounded-md hover:bg-gray-700"
          >
            + Add user
          </button>
        </div>
      </div>

      <Table
        bottomContent={
          !isLoading && pages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(newPage) => setPage(newPage)}
              />
            </div>
          ) : null
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn key="name">NAME</TableColumn>
          <TableColumn key="role">ROLE</TableColumn>
          <TableColumn key="status">STATUS</TableColumn>
          <TableColumn key="permission" className="flex items-center">
            PERMISSIONS
            <Tooltip showArrow content={tooltipText}>
              <Image
                alt="info icon"
                className="invert ml-1"
                src="/info.png"
                width={15}
                height={15}
              />
            </Tooltip>
          </TableColumn>
          <TableColumn className="" key="edit">
            {" "}
          </TableColumn>
        </TableHeader>
        <TableBody
          items={items}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
          emptyContent={!isLoading && "No users found"}
        >
          {(item) => (
            <TableRow key={item.name}>
              {(columnKey) => {
                if (columnKey === "permission") {
                  return (
                    <TableCell>
                      {item.permissions?.length > 0
                        ? formatPermissions(item.permissions)
                        : "-"}
                    </TableCell>
                  );
                }
                if (columnKey === "edit") {
                  return (
                    <TableCell>
                      <Button onPress={() => handleEditClick(item)}>
                        <Image
                          src="/edit.png"
                          height={15}
                          width={15}
                          alt="edit icon"
                          className="invert"
                        />
                      </Button>
                      <Button onPress={() => handleDeleteClick(item)} color="danger" className="ml-2">
                        <Image
                          src="/delete.png"
                          height={15}
                          width={15}
                          alt="edit icon"
                          className="invert"
                        />
                      </Button>
                    </TableCell>
                  );
                }
                return <TableCell>{getKeyValue(item, columnKey)}</TableCell>;
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Edit User Modal */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit User: {selectedUser?.name}
              </ModalHeader>
              <ModalBody>
                <p>Role: {selectedUser?.role}</p>
                <p>Status: {selectedUser?.status}</p>
                <p>Permissions: {selectedUser?.permissions?.join(", ")}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Add User Modal */}
      <Modal
        backdrop="opaque"
        isOpen={isAddOpen}
        onOpenChange={onAddClose}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Add New User
          </ModalHeader>

          <ModalBody>
            <Input
              isClearable
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4"
            />

            <Input
              isClearable
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />

            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" className="capitalize">
                  {role || "Select Role"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select Role"
                variant="flat"
                selectionMode="single"
                onSelectionChange={(keys) =>
                  setRole(Array.from(keys)[0] as string)
                }
              >
                {roles.length > 0 ? (
                  roles.map((roleItem) => (
                    <DropdownItem key={roleItem.name}>
                      {roleItem.name}
                    </DropdownItem>
                  ))
                ) : (
                  <>
                    <DropdownItem key="None">No roles availabel</DropdownItem>
                  </>
                )}
              </DropdownMenu>
            </Dropdown>

            <div className="flex items-center mt-4">
              <p className="mr-4">Status</p>
              <Switch
                isSelected={status}
                onValueChange={setStatus}
                color="primary"
                size="lg"
              >
                {status ? "Active" : "Inactive"}
              </Switch>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button color="danger" variant="light" onPress={onAddClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleAddUser}>
              Save User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete User Modal */}
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
          <ModalHeader className="flex flex-col gap-1">
            Delete User
          </ModalHeader>

          <ModalBody>
            <p>Do you want to delete user : {" " +selectedUser?.name}</p>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" variant="light" onPress={onDeleteClose}>
              Cancel
            </Button>
            <Button color="danger"   onPress={() => handleDeleteUser(selectedUser?.id)}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
}
