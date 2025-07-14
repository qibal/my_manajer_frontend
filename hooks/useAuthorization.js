import { useContext } from 'react';
// Asumsi Anda punya AuthContext yang menyediakan data user
// import { AuthContext } from '@/context/AuthContext'; 

// Import data izin dinamis
import menuPermissions from '@/data_dummy/dashboard/menu_permission.json';

// --- CONTOH DATA USER ---
// Ini hanya untuk simulasi, idealnya ini datang dari AuthContext
const MOCK_USER = {
  id: 3,
  username: "janedoe",
  name: "Jane Doe",
  roleId: "super_admin", // <-- Ganti ini untuk tes role lain (e.g., 'creative_team', 'investor')
};
// --- HAPUS INI JIKA SUDAH ADA AuthContext ---


export function useAuthorization() {
  // Ganti MOCK_USER dengan data dari context sesungguhnya
  // const { user } = useContext(AuthContext); 
  const user = MOCK_USER; // Hapus baris ini jika sudah pakai context

  if (!user || !user.roleId) {
    // Jika tidak ada user atau roleId, tidak ada izin
    return {
      canAccess: () => false,
      getAccessLevel: () => null,
      roleId: null,
    };
  }

  // Ambil daftar izin untuk peran pengguna dari file JSON
  const permissionsForRole = menuPermissions[user.roleId] || {};

  /**
   * Memeriksa apakah pengguna bisa mengakses sebuah menu.
   * @param {string} menuId - ID unik dari menu (e.g., 'dashboard', 'projects').
   * @returns {boolean} - True jika punya akses (level apapun), false jika tidak.
   */
  const canAccess = (menuId) => {
    // Super admin selalu bisa akses semuanya
    if (user.roleId === 'super_admin') {
      return true;
    }
    // Cek apakah menuId ada di dalam daftar izin untuk peran tersebut
    return !!permissionsForRole[menuId];
  };

  /**
   * Mendapatkan tingkat akses pengguna untuk sebuah menu.
   * @param {string} menuId - ID unik dari menu.
   * @returns {'full_access' | 'edit' | 'read_only' | null}
   */
  const getAccessLevel = (menuId) => {
    if (user.roleId === 'super_admin') {
      return 'full_access';
    }
    return permissionsForRole[menuId] || null;
  };

  return { canAccess, getAccessLevel, roleId: user.roleId };
}

