import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

class ExcelManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.ensureFileExists();
    }

    ensureFileExists() {
        if (!fs.existsSync(this.filePath)) {
            const dir = path.dirname(this.filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        }
    }

    // Leer datos con encabezados en FILA 1
    async getData() {
        try {
            if (!fs.existsSync(this.filePath)) {
                return { headers: [], data: [] };
            }

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(this.filePath);
            
            const worksheet = workbook.worksheets[0];
            
            if (!worksheet) {
                throw new Error('El archivo no tiene hojas.');
            }
            
            // 1. Obtener encabezados de la FILA 1
            const headers = [];
            const headerRow = worksheet.getRow(1);
            
            headerRow.eachCell((cell, colNumber) => {
                const headerValue = this.extractCellValue(cell.value);
                if (headerValue) {
                    headers.push({
                        index: colNumber,
                        name: headerValue
                    });
                }
            });

            console.log('📋 Encabezados detectados:', headers.map(h => h.name).join(', '));

            // 2. Obtener datos desde la FILA 2 en adelante
            const data = [];

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) { // Saltar fila 1 (encabezados)
                    const rowData = {
                        id: rowNumber,
                        rowNumber: rowNumber
                    };

                    // Agregar cada columna usando el nombre del encabezado
                    headers.forEach(header => {
                        const cellValue = row.getCell(header.index).value;
                        rowData[header.name] = this.extractCellValue(cellValue);
                    });

                    data.push(rowData);
                }
            });
            
            console.log(`📊 ${data.length} filas de datos cargadas`);
            
            return { headers, data };
        } catch (error) {
            console.error('Error al leer datos:', error);
            throw new Error(`No se pudo leer el archivo: ${error.message}`);
        }
    }

    // Obtener solo encabezados
    async getHeaders() {
        try {
            if (!fs.existsSync(this.filePath)) {
                return [];
            }

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(this.filePath);
            
            const worksheet = workbook.worksheets[0];
            
            if (!worksheet) {
                throw new Error('El archivo no tiene hojas.');
            }
            
            const headers = [];
            const headerRow = worksheet.getRow(1);
            
            headerRow.eachCell((cell, colNumber) => {
                const headerValue = this.extractCellValue(cell.value);
                if (headerValue) {
                    headers.push({
                        index: colNumber,
                        name: headerValue,
                        originalName: headerValue
                    });
                }
            });
            
            return headers;
        } catch (error) {
            console.error('Error al obtener encabezados:', error);
            throw new Error(`No se pudieron obtener los encabezados: ${error.message}`);
        }
    }

    // Extrae valor de celda
    extractCellValue(cellValue) {
        if (!cellValue) return "";
        
        // Si es un hipervínculo
        if (cellValue.text !== undefined) return cellValue.text;
        
        // Si es una fórmula con resultado
        if (cellValue.result !== undefined) return cellValue.result;
        
        // Si es un objeto Date
        if (cellValue instanceof Date) return cellValue.toISOString();
        
        // Valor simple
        return cellValue.toString();
    }

    // Actualizar celda
    async updateCell(rowNumber, colName, newValue) {
        try {
            if (!fs.existsSync(this.filePath)) {
                throw new Error('El archivo no existe.');
            }

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(this.filePath);
            
            const worksheet = workbook.worksheets[0];
            
            if (!worksheet) {
                throw new Error('El archivo no tiene hojas.');
            }

            // Validar que rowNumber sea válido (debe ser >= 2 porque fila 1 son encabezados)
            if (rowNumber < 2 || rowNumber > worksheet.rowCount) {
                throw new Error(`Número de fila inválido: ${rowNumber}`);
            }

            // Encontrar la columna por nombre
            const colIndex = this.findColumnIndex(worksheet, colName);
            if (colIndex === -1) {
                throw new Error(`La columna "${colName}" no existe en los encabezados.`);
            }

            // Modificar la celda
            const row = worksheet.getRow(rowNumber);
            const cell = row.getCell(colIndex);
            const oldValue = this.extractCellValue(cell.value);
            
            cell.value = newValue;
            row.commit();
            
            // Guardar cambios
            await workbook.xlsx.writeFile(this.filePath);
            
            console.log(`✓ Actualizado: Fila ${rowNumber}, Columna "${colName}": "${oldValue}" → "${newValue}"`);
            
            return { 
                success: true,
                message: "Celda actualizada correctamente",
                oldValue,
                newValue,
                row: rowNumber,
                column: colName
            };
        } catch (error) {
            console.error('Error al actualizar celda:', error);
            throw new Error(`No se pudo actualizar: ${error.message}`);
        }
    }

    // Encuentra el índice de columna por nombre del encabezado (fila 1)
    findColumnIndex(worksheet, colName) {
        const headerRow = worksheet.getRow(1);
        let colIndex = -1;
        
        headerRow.eachCell((cell, colNumber) => {
            const cellValue = this.extractCellValue(cell.value);
            if (cellValue.toLowerCase().trim() === colName.toLowerCase().trim()) {
                colIndex = colNumber;
            }
        });
        
        return colIndex;
    }
}

export default ExcelManager;