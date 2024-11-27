"use client";
import React, { useState, useEffect } from 'react';
import {
  Checkbox,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner
} from "@nextui-org/react";

const RoleTable = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRolesAndPermissions = async () => {
    setIsLoading(true);
    try {
      
      const rolesResponse = await fetch("http://localhost:3001/roles");
      if (!rolesResponse.ok) {
        throw new Error("Failed to fetch roles");
      }
      const rolesData = await rolesResponse.json();
      setRoles(rolesData);

      
      const permissionsResponse = await fetch("http://localhost:3001/permissions");
      if (!permissionsResponse.ok) {
        throw new Error("Failed to fetch permissions");
      }
      const permissionsData = await permissionsResponse.json();
      setPermissions(permissionsData);
    } catch (error) {
      console.error("Error fetching roles and permissions:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const handlePermissionToggle = async (roleId, permissionType) => {
    try {
      
      const currentPermissionEntry = permissions.find(p => p.role_id === roleId);
      
      if (!currentPermissionEntry) {
        console.error(`No permissions found for role ${roleId}`);
        return;
      }

 
      let newPermissions = [...currentPermissionEntry.permissions];
      
      
      if (newPermissions.includes(permissionType)) {
        newPermissions = newPermissions.filter(p => p !== permissionType);
      } else {
        newPermissions.push(permissionType);
      }

      
      const updatePayload = {
        ...currentPermissionEntry,
        permissions: newPermissions
      };

      
      const response = await fetch(`http://localhost:3001/permissions/${currentPermissionEntry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        throw new Error('Failed to update permissions');
      }

      
      setPermissions(prevPermissions => 
        prevPermissions.map(p => 
          p.id === currentPermissionEntry.id 
            ? { ...p, permissions: newPermissions } 
            : p
        )
      );
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  const getPermissionsForRole = (roleId) => {
    const rolePermission = permissions.find(p => p.role_id === roleId);
    return {
      read: rolePermission?.permissions.includes("Read") || false,
      write: rolePermission?.permissions.includes("Write") || false,
      edit: rolePermission?.permissions.includes("Edit") || false,
      delete: rolePermission?.permissions.includes("Delete") || false
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
      <Table
        aria-label="Role Management Table"
        css={{
          height: "auto",
          minWidth: "100%",
        }}
        bordered
        shadow={false}
      >
        <TableHeader>
          <TableColumn>ROLE NAME</TableColumn>
          <TableColumn>READ</TableColumn>
          <TableColumn>WRITE</TableColumn>
          <TableColumn>EDIT</TableColumn>
          <TableColumn>DELETE</TableColumn>
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
                    onValueChange={() => handlePermissionToggle(role.id, "Read")}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox 
                    color="default" 
                    isSelected={permissions.write}
                    onValueChange={() => handlePermissionToggle(role.id, "Write")}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox 
                    color="default" 
                    isSelected={permissions.edit}
                    onValueChange={() => handlePermissionToggle(role.id, "Edit")}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox 
                    color="default" 
                    isSelected={permissions.delete}
                    onValueChange={() => handlePermissionToggle(role.id, "Delete")}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default RoleTable;