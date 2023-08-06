import React, { useState } from "react";
import usersData from "../data/celebrities.json";
import {
  TextField,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { ExpandMore, ExpandLess, Edit, Delete } from "@mui/icons-material";

const UserList = () => {
  const [users, setUsers] = useState(usersData);
  const [openUserId, setOpenUserId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [editedUser, setEditedUser] = useState(null);

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const toggleDetails = (userId) => {
    setOpenUserId((prevOpenUserId) =>
      prevOpenUserId === userId ? null : userId
    );
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleEdit = (user) => {
    if (openUserId === user.id) {
      setEditedUser({ ...user });
    }
  };

  const handleSave = () => {
    if (editedUser.age === "" || isNaN(editedUser.age) || editedUser.age < 18) {
      alert("Age should be a valid number and the user must be an adult.");
      return;
    }

    if (editedUser.country.trim() === "") {
      alert("Country cannot be empty.");
      return;
    }

    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === editedUser.id ? editedUser : user))
    );
    setEditedUser(null);
  };

  const handleCancel = () => {
    setEditedUser(null);
  };

  const handleDelete = (user) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
    }
  };

  const handleGenderChange = (e) => {
    setEditedUser({
      ...editedUser,
      gender: e.target.value,
    });
  };

  const handleDateOfBirthChange = (e) => {
    const dob = e.target.value;
    setEditedUser({
      ...editedUser,
      dob,
      age: calculateAge(dob),
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.first.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.last.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="container">
      <TextField
        label="Search"
        variant="outlined"
        value={searchValue}
        onChange={handleSearchChange}
      />
      <Grid container spacing={2}>
        {filteredUsers.map((user) => (
          <Grid item xs={12} md={6} lg={4} key={user.id}>
            <Card className="card">
              <CardContent>
                <div className="user-container">
                  <img
                    className="img-circle"
                    src={user.picture}
                    alt={`${user.first} ${user.last}`}
                  />
                  <div>
                    Name: {user.first} {user.last}
                  </div>
                </div>

                <IconButton
                  onClick={() => toggleDetails(user.id)}
                  aria-expanded={openUserId === user.id}
                  className={`arrow-button ${
                    openUserId === user.id ? "active" : ""
                  }`}
                >
                  {openUserId === user.id ? <ExpandLess /> : <ExpandMore />}
                </IconButton>

                <Collapse in={openUserId === user.id}>
                  <div className="user-details">
                    <div>
                      Date of Birth:{" "}
                      {editedUser && editedUser.id === user.id ? (
                        <input
                          type="date"
                          value={editedUser.dob}
                          onChange={handleDateOfBirthChange}
                        />
                      ) : (
                        user.dob
                      )}
                    </div>
                    <div>
                      {editedUser && editedUser.id === user.id ? (
                        <>
                          Age:{" "}
                          <input
                            type="text"
                            value={editedUser.age}
                            onChange={(e) =>
                              setEditedUser({
                                ...editedUser,
                                age: e.target.value,
                              })
                            }
                          />
                        </>
                      ) : (
                        <>Age: {calculateAge(user.dob)}</>
                      )}
                    </div>
                    {editedUser && editedUser.id === user.id ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <InputLabel>Gender</InputLabel>
                        <FormControl
                          style={{ marginLeft: "10px", width: "100%" }}
                        >
                          <Select
                            value={editedUser.gender}
                            onChange={handleGenderChange}
                            style={{ width: "50%", height: "50%" }}
                          >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Transgender">Transgender</MenuItem>
                            <MenuItem value="Rather not say">
                              Rather not say
                            </MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    ) : (
                      <div>Gender: {user.gender}</div>
                    )}
                    {editedUser && editedUser.id === user.id ? (
                      <div>
                        Country:{" "}
                        <input
                          type="text"
                          value={editedUser.country}
                          onChange={(e) =>
                            setEditedUser({
                              ...editedUser,
                              country: e.target.value,
                            })
                          }
                        />
                      </div>
                    ) : (
                      <div>Country: {user.country}</div>
                    )}
                    <div>
                      Description:{" "}
                      {editedUser && editedUser.id === user.id ? (
                        <textarea
                          value={editedUser.description}
                          onChange={(e) =>
                            setEditedUser({
                              ...editedUser,
                              description: e.target.value,
                            })
                          }
                        />
                      ) : (
                        user.description
                      )}
                    </div>

                    {/* Edit and Delete Buttons */}
                    {editedUser && editedUser.id === user.id ? (
                      <>
                        <Button onClick={handleSave}>Save</Button>
                        <Button onClick={handleCancel}>Cancel</Button>
                      </>
                    ) : (
                      <div className="edit-delete-buttons">
                        <IconButton onClick={() => handleEdit(user)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(user)}>
                          <Delete />
                        </IconButton>
                      </div>
                    )}
                  </div>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default UserList;
