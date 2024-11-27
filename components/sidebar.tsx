import Image from "next/image";
import Link from "next/link";

export const Sidebar = () => {
  return (
    <section className={`w-2/12 bg-zinc-900 h-screen md:block hidden`}>
      <div className=" p-5 w-full  flex   flex-col">
        <div className=" w-full flex justify-start items-center flex-row">
          <Image
            alt="Admin icon"
            className="invert"
            height={35}
            src="/admin.png"
            width={35}
          />
          <h1 className={`text-4xl font-bold text-white ml-2 `}>RBAC</h1>
        </div>

        <p className="ml-1 text-zinc-400">Role-Based Access Control</p>
      </div>
      <div className=" flex sidebarItems bg-zinc-800 h-fit rounded-xl pl-5 py-5 m-5 flex-col">
        <p className="tabsection mb-3 text-zinc-400 "> GENERAL</p>
        <ul className=" flex-col space-y-3 ">
          <li>
            <Link className="flex items-center" href="/usermng">
              <Image
                alt="user icon"
                className="invert mr-2"
                height={26}
                src="/user.png"
                width={26}
              />
              User Management
            </Link>
          </li>
          <li className="flex items-center">
            <Link className="flex items-center" href="/rolemng">
              <Image
                alt="role icon"
                className="invert mr-2"
                height={26}
                src="/role.png"
                width={26}
              />
              Role Management
            </Link>
            </li>
          {/* <li className="flex items-center">
            <Link className="flex items-center" href="/permission">
              <Image
                alt="permission icon"
                className="invert mr-2"
                height={26}
                src="/permission.png"
                width={26}
              />
              Permissions
            </Link>
          </li> */}
        </ul>
      </div>
    </section>
  );
};
