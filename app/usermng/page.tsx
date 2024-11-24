"use client";

import React from "react";
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
  useDisclosure
} from "@nextui-org/react";


import { users } from "./data";

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
  const [page, setPage] = React.useState(1);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  
  const rowsPerPage = 10;
  const pages = Math.ceil(users.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return users.slice(start, end);
  }, [page, users]);

  const handleEditClick = (user:any) => {
    setSelectedUser(user);
    onOpen();
  };

  const tooltipText = (
    <>
      R-READ<br />
      W-WRITE<br />
      E-EDIT<br />
      D-DELETE
    </>
  );

  return (
    <section>
      <h1 className="font-bold text-3xl">User management</h1>
      <p className="text-zinc-400 mb-5">Manage users and their role here.</p>
      
      <Table
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={setPage}
            />
          </div>
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
          <TableColumn className="item" key="edit">{" "}</TableColumn>
        </TableHeader>
        <TableBody items={items}>
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
                      <Button className="" onPress={() => handleEditClick(item)}>
                        <Image
                        src="/edit.png"
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit User: {selectedUser?.name}
              </ModalHeader>
              <ModalBody>
                <p>
                  Role: {selectedUser?.role}
                </p>
                <p>
                  Status: {selectedUser?.status}
                </p>
                <p>
                  Permissions: {selectedUser?.permissions?.join(", ")}
                </p>
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
    </section>
  );
}