import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import MetaTags from "react-meta-tags";
import axios from "axios";
import AdminHeader from "./../layouts/AdminHeader";
import AdminSider from "./../layouts/AdminSider";

const AdminUser = (props) => {
  const [state, setState] = useState([]);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3003/get-users").then((res) => {
      setState(res.data.result);
    });
  }, []);

  // useEffect(() => {
  //   window.addEventListener(
  //     "scroll",
  //     () => {
  //       window.scrollY > 100 ? setSticky("sticky") : setSticky("");
  //     },
  //     false
  //   );
  // });

  const deleteUser = (id) => {
    axios.delete(`http://localhost:3003/${id}`).then((res) => {
      setError(true);
      setErrorMsg(res.data.Msg);
    });
  };

  return (
    <div>
      <MetaTags>
        <title>Acres - Real Estate React Template | Admin</title>
        <meta name="description" content="#" />
      </MetaTags>
      <AdminHeader />
      <AdminSider url={props.url} />
      <div className="text-center" style={{ margin: "20px" }}>
        <h2>Users</h2>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <table
          className="table-striped table-bordered text-center"
          style={{ width: "90%", margin: "1%" }}
        >
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>User</th>
              <th>CreatedAt</th>
              <th>Admin</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {state.map((res, key) => {
              return (
                <tr>
                  <td>{key + 1}</td>
                  <td>{res.name}</td>
                  <td>{res.email}</td>
                  <td>{res.user}</td>
                  <td>{res.createdAt}</td>
                  <td>{`${res.isAdmin}`}</td>
                  <td>
                    <button
                      onClick={() => deleteUser(res._id)}
                      style={{ borderRadius: "5px" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {error ? (
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              width: "70%",
              backgroundColor: "#FF3131",
              color: "white",
              padding: "10px 20px 10px 20px",
              borderRadius: "5px",
              alignItems: "center",
            }}
          >
            <span>{error ? `${errorMsg}` : ""}</span>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                border: "white 2px solid",
                borderRadius: "30px",
                width: "40px",
                backgroundColor: "#FF3131",
                height: "40px",
              }}
              onClick={() => {
                setError(false);
              }}
            >
              <p
                style={{
                  color: "white",
                  alignItems: "center",
                  marginTop: "3px",
                }}
              >
                x
              </p>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default AdminUser;
