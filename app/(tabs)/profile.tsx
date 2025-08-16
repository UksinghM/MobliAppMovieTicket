import React, { useState } from 'react';

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('Utkarsh Singh');
  const [email, setEmail] = useState('utkarsh@example.com');
  const [avatar, setAvatar] = useState('https://i.pravatar.cc/150?img=3');

  const handleSave = () => {
    setEditing(false);
    // Optionally, send the updated profile to backend here!
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Profile</h2>
      <img src={avatar} alt="avatar" style={styles.avatar} />
      {editing ? (
        <div style={styles.form}>
          <input
            style={styles.input}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
          />
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            style={styles.input}
            type="text"
            value={avatar}
            onChange={e => setAvatar(e.target.value)}
            placeholder="Avatar URL"
          />
          <button style={styles.button} onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div style={styles.info}>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
          <button style={styles.button} onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

// Inline CSS styles for demo purpose
const styles = {
  container: {
    padding: 30,
    maxWidth: 350,
    margin: '40px auto',
    background: '#fff',
    borderRadius: 24,
    boxShadow: '0 2px 16px rgba(44,20,70,0.12)',
    textAlign: 'center'
  },
  header: {
    color: '#56208e',
    fontWeight: 900,
    marginBottom: 20
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: 20,
    border: '3px solid #6c63ff'
  },
  info: { marginTop: 20 },
  form: { marginTop: 20 },
  input: {
    width: '90%',
    padding: '10px',
    fontSize: 16,
    margin: '10px 0',
    borderRadius: 7,
    border: '1px solid #ccc'
  },
  button: {
    background: '#56208e',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 24px',
    fontWeight: 700,
    fontSize: 16,
    cursor: 'pointer',
    marginTop: 14
  }
};

export default Profile;
