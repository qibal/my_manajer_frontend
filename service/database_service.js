import backend from "../lib/backend_service";

const databaseService = {
  async createDatabase(databaseData) {
    const res = await backend.post("/databases", databaseData);
    return res.data;
  },

  async getDatabasesByChannelId(channelId) {
    const res = await backend.get(`/databases/channel/${channelId}`);
    return res.data;
  },

  async getDatabaseById(id) {
    const res = await backend.get(`/databases/${id}`);
    return res.data;
  },

  async updateDatabase(id, databaseData) {
    const res = await backend.put(`/databases/${id}`, databaseData);
    return res.data;
  },

  async deleteDatabase(id) {
    const res = await backend.delete(`/databases/${id}`);
    return res.data;
  },

  async addRowToDatabase(databaseId, rowData) {
    const res = await backend.post(`/databases/${databaseId}/rows`, rowData);
    return res.data;
  },

  async updateRowInDatabase(databaseId, rowId, rowData) {
    const res = await backend.put(`/databases/${databaseId}/rows/${rowId}`, rowData);
    return res.data;
  },

  async deleteRowFromDatabase(databaseId, rowId) {
    const res = await backend.delete(`/databases/${databaseId}/rows/${rowId}`);
    return res.data;
  },

  async addColumnToDatabase(databaseId, columnData) {
    // API swagger tidak memiliki endpoint POST /databases/{id}/columns
    // Namun, ada endpoint PUT /databases/{id} yang bisa update columns.
    // Untuk menambah kolom, kita perlu mengambil database, menambahkan kolom, lalu update database.
    // Atau backend perlu endpoint spesifik. Untuk sementara, kita asumsikan backend akan update melalui endpoint PUT /databases/{id}
    // atau ini adalah operasi client-side sebelum POST/PUT ke backend.
    // Berdasarkan swagger.json, DatabaseUpdateRequest memiliki field 'columns' (array of DatabaseColumnRequest).
    // Jadi, untuk menambahkan kolom baru, kita akan memanggil `updateDatabase` dengan daftar kolom yang diperbarui.
    // API tidak memiliki endpoint langsung untuk add column, jadi ini perlu diperjelas.
    // Karena page.js saat ini memanipulasi mock data, saya akan mengimplementasikan ini berdasarkan bagaimana ia dapat diintegrasikan
    // dengan skema API yang ada, yang berarti "menambah kolom" akan menjadi bagian dari "update database".
    // Untuk saat ini, karena API tidak langsung mendukung `POST /databases/{id}/columns`, saya tidak akan menambahkan metode ini.
    // Sebaliknya, jika `page.js` menambah kolom, itu harus memanggil `updateDatabase` dengan seluruh array kolom yang diperbarui.
    // Saya akan fokus pada yang ada di swagger dulu.
    throw new Error("Add column directly is not supported by current API spec. Use updateDatabase with updated columns array.");
  },

  async updateColumnInDatabase(databaseId, columnId, columnData) {
    const res = await backend.put(`/databases/${databaseId}/columns/${columnId}`, columnData);
    return res.data;
  },

  async deleteColumnFromDatabase(databaseId, columnId) {
    const res = await backend.delete(`/databases/${databaseId}/columns/${columnId}`);
    return res.data;
  },

  async addSelectOptionToColumn(databaseId, columnId, optionData) {
    const res = await backend.post(`/databases/${databaseId}/columns/${columnId}/options`, optionData);
    return res.data;
  },

  async updateSelectOptionInColumn(databaseId, columnId, optionId, optionData) {
    const res = await backend.put(`/databases/${databaseId}/columns/${columnId}/options/${optionId}`, optionData);
    return res.data;
  },

  async deleteSelectOptionFromColumn(databaseId, columnId, optionId) {
    const res = await backend.delete(`/databases/${databaseId}/columns/${columnId}/options/${optionId}`);
    return res.data;
  },
};

export default databaseService;
