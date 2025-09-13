import { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../common/BackButton';
import './UserProfile.css';
const API_URL = import.meta.env.VITE_API_URL;
function UserProfile() {
  const userId = localStorage.getItem('user_id');
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    } else {
      console.error("❌ User ID not found in localStorage");
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/${userId}`,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
      console.log('✅ Profile fetched:', res.data);
      if (res.data) {
        setProfile(res.data);
        setIsNew(false);
      } else {
        promptNewProfile();
      }
    } catch (err) {
      console.warn('⚠️ Profile not found, creating new one...');
      promptNewProfile();
    } finally {
      setLoading(false);
    }
  };

  const promptNewProfile = () => {
    setIsNew(true);
    setIsEditing(true);
    setProfile({
      id: userId,
      name: '',
      email: '',
      role: 'Student',
      avatar: '',
      department: '',
      year: '',
      joinDate: new Date().toISOString().slice(0, 10), // today's date
      booksIssued: 0
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNew) {
        await axios.post(`${API_URL}/users`, profile);
      } else {
        await axios.put(`${API_URL}/users/${userId}`, profile);
      }
      setIsEditing(false);
      setIsNew(false);
    } catch (err) {
      console.error('❌ Failed to save profile:', err);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <BackButton />
      <div className="profile-header">
        <img
          src={profile?.avatar || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400'}
          alt={profile?.name || 'User Avatar'}
          className="profile-avatar"
        />
        <div className="profile-title">
          <h2>{profile?.name || 'New User'}</h2>
          <span className="profile-role">{profile?.role || 'Student'}</span>
        </div>
      </div>

      <div className="profile-card">
        {(isEditing || isNew) ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Avatar URL:</label>
              <input
                type="text"
                value={profile.avatar}
                onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Department:</label>
              <input
                type="text"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Year:</label>
              <input
                type="text"
                value={profile.year}
                onChange={(e) => setProfile({ ...profile, year: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Join Date:</label>
              <input
                type="date"
                value={profile.joinDate}
                onChange={(e) => setProfile({ ...profile, joinDate: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-button">
                {isNew ? 'Create Profile' : 'Save Changes'}
              </button>
              {!isNew && (
                <button type="button" onClick={() => setIsEditing(false)} className="cancel-button">
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-section">
              <h3>Personal Information</h3>
              <div className="info-grid">
                <div className="info-item"><span className="info-label">Name</span><span className="info-value">{profile.name}</span></div>
                <div className="info-item"><span className="info-label">Email</span><span className="info-value">{profile.email}</span></div>
                <div className="info-item"><span className="info-label">ID</span><span className="info-value">{profile.id}</span></div>
                <div className="info-item"><span className="info-label">Department</span><span className="info-value">{profile.department}</span></div>
                <div className="info-item"><span className="info-label">Year</span><span className="info-value">{profile.year}</span></div>
                <div className="info-item"><span className="info-label">Join Date</span><span className="info-value">{profile.joinDate || 'N/A'}</span></div>
              </div>
            </div>

            {/* <div className="info-section">
              <h3>Library Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item"><span className="stat-value">{profile.booksIssued ?? 0}</span><span className="stat-label">Books Issued</span></div>
                <div className="stat-item"><span className="stat-value">0</span><span className="stat-label">Overdue</span></div>
                <div className="stat-item"><span className="stat-value">12</span><span className="stat-label">Total Borrowed</span></div>
              </div>
            </div> */}

            <button onClick={() => setIsEditing(true)} className="edit-button">
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
