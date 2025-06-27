import React from "react";
import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);

  const getPasswords = async () => {
    try {
      let req = await fetch("http://localhost:3000/");
      let data = await req.json();
      setPasswordArray(data);
    } catch (error) {
      console.error("Error fetching passwords:", error);
    }
  };
  

  useEffect(() => {
    getPasswords();
  }, []);

  const copyText = (text) => {
    toast("Copied to clipboard!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    navigator.clipboard.writeText(text);
  };
  const showPassword = () => {
    if (!ref.current || !passwordRef.current) return;
    if (ref.current.src.includes("icons/eyecross.png")) {
      ref.current.src = "icons/eye.png";
      passwordRef.current.type = "password";
    } else {
      ref.current.src = "icons/eyecross.png";
      passwordRef.current.type = "text";
    }
  };

  const savePassword = async () => {
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length > 3
    ) {
      const newPassword = {...form, _id: uuidv4()};
      setPasswordArray([...passwordArray, newPassword]);
      await fetch("http://localhost:3000/", {method: "POST", headers: {"Content-Type":"application/json"},body: JSON.stringify(newPassword)})
      getPasswords();
      setform({ site: "", username: "", password: "" });
      toast("Password Saved Successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      toast("Error: Password not save!");
    }
  };

  const deletePassword = async (id) => {
    console.log("Deleting password with id ",id)
    let c = window.confirm("Do you really want to delete this password?");
    if (c) {
      setPasswordArray(passwordArray.filter((item) => item._id !== id));
      await fetch("http://localhost:3000/", {method: "DELETE",headers: { "Content-Type": "application/json" },body: JSON.stringify({ id })}),
      toast("Password Deleted!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const editPassword = async (id) => {
    console.log("Editing password with id ", id);
    const passwordToEdit = passwordArray.find((i) => i._id === id);
    if (!passwordToEdit) {
      toast("Error: Password not found!");
      return;
    }
    setform(passwordToEdit);
    setPasswordArray(passwordArray.filter((item)=> item._id !== id));
    await fetch("http://localhost:3000/", {method: "DELETE",headers: { "Content-Type": "application/json" },body: JSON.stringify({ id })})
  };
  

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="Bounce"
      />
      {/* Same as */}
      <ToastContainer />
      <div className="fixed inset-0 -z-10 h-full w-full bg-slate-950">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>
      <div className="p-3 md:px-40 md:py-16 md:container md:mx-auto ">
        <h1 className="text-4xl font-bold text-center text-white">
          <span className="text-green-700">&lt;</span>Pass<span className="text-green-700">OP/&gt;</span>
        </h1>
        <p className="text-white text-lg text-center">Your own Password Manager</p>
        <div className="text-black flex flex-col p-4 gap-8 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter website URL"
            className="bg-white rounded-full w-full p-4 py-1"
            type="text"
            name="site"
            id="site"
          />
          <div className="flex flex-col md:flex-row w-full justify-between gap-8">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="bg-white rounded-full w-full p-4 py-1"
              type="text"
              name="username"
              id="username"
            />
            <div className="relative">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="bg-white rounded-full w-full p-4 py-1"
                type="password"
                name="password"
                id="password"
              />
              <span
                className="absolute right-[3px] top-[4px] cursor-pointer"
                onClick={showPassword}
              >
                <img
                  ref={ref}
                  className="p-1"
                  width={26}
                  src="/icons/eye.png"
                  alt="eye"
                />
              </span>
            </div>
          </div>
          <button
            onClick={savePassword}
            className="text-black flex justify-center items-center rounded-full px-8 py-2 gap-2 w-fit bg-green-400 hover:bg-green-300"
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
            ></lord-icon>
            Save Password
          </button>
        </div>
        <div className="passwords">
          <h2 className="text-white font-bold text-2xl py-4">Your Passwords</h2>
          {passwordArray.length === 0 && <div className="text-white"> No passwords to show </div>}
          {passwordArray.length != 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden mb-10">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="py-2 border border-white text-center">
                        <div className="flex items-center justify-center">
                          <a href={item.site} target="_blank" className="overflow-x-auto max-w-[80px] md:max-w-[120px] lg:max-w-[200px] whitespace-nowrap scrollbar-hide hover:scrollbar-visible ">
                            {item.site}
                          </a>
                          <div
                            className="lordiconcopy size-7 cursor-pointer"
                            onClick={() => copyText(item.site)}
                          >
                            <lord-icon
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-white text-center">
                        <div className="flex items-center justify-center">
                          <div className="overflow-x-auto max-w-[70px] md:max-w-[120px] lg:max-w-[200px] scrollbar-hide whitespace-nowrap hover:scrollbar-visible">
                          {item.username}
                          </div>
                          <div
                            className="lordiconcopy size-7 cursor-pointer"
                            onClick={() => copyText(item.username)}
                          >
                            <lord-icon
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-white text-center">
                        <div className="flex items-center justify-center">
                          <span className="overflow-x-auto max-w-[70px] md:max-w-[120px] lg:max-w-[200px] scrollbar-hide whitespace-nowrap hover:scrollbar-visible">{"*".repeat(item.password.length)}</span>
                          <div
                            className="lordiconcopy size-7 cursor-pointer"
                            onClick={() => copyText(item.password)}
                          >
                            <lord-icon
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-white text-center">
                        <span
                          className="cursor-pointer mx-1"
                          onClick={() => editPassword(item._id)}
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/gwlusjdu.json"
                            trigger="hover"
                            style={{ width: "25px", height: "25px" }}
                          ></lord-icon>
                        </span>
                        <span
                          className="cursor-pointer mx-1"
                          onClick={() => deletePassword(item._id)}
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/skkahier.json"
                            trigger="hover"
                            style={{ width: "25px", height: "25px" }}
                          ></lord-icon>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
    </>
  );
};

export default Manager;
