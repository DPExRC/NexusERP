import apiClient from '@/config/api'; 

export const excelService = {
  async getAll() {
    const response = await apiClient.get('/excel/get-excel');
    return response.data; 
  },

  async updateCell(rowIndex, columnName, value) {
    const response = await apiClient.post('/excel/update-excel', {
      rowIndex,
      columnName,
      newValue: value
    });
    return response.data;
  }
};