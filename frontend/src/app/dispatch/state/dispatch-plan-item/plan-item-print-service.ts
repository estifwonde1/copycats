import { Injectable } from '@angular/core';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DispatchPlanItemQuery } from './dispatch-plan-item.query';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Injectable({ providedIn: 'root'})
export class PlanItemPrintService {
    constructor(private dispatchPlanItemQuery: DispatchPlanItemQuery) {}

    printRRD(requisitionNumber: string, planReference: string) {
        const items: any[] = this.dispatchPlanItemQuery.getAll().filter((rec: any) => rec.reference_no === requisitionNumber);
        if(items) {
            this.preparePdf(items, requisitionNumber, planReference);
        }
    }

    preparePdf(items: any[], requisitionNumber: string, planReference: string) {
        const docDefinition: any = {
        pageMargins: [40, 60, 40, 40],
        pageSize: 'A3',
        pageOrientation: 'landscape',
    
        header: function() {
            return [
              { text: 'National Disaster Risk Management Comission', alignment: 'center', margin: [10, 10, 10, 10] },
              { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 1160, y2: 10, lineWidth: 1 }] }
            ]
        },

        footer: function (currentPage: any, pageCount: any) {
            return [{ canvas: [{ type: 'line', x1: 10, y1: 10, x2: 1160, y2: 10, lineWidth: 1 }] },
                    { text: 'Page ' + currentPage.toString() + ' of ' + pageCount,
                    alignment: 'right', style: 'normalText', margin: [0, 10, 10, 0] }]
        },
        
        content: [],
    
        styles: {
            header: {
            fontSize: 14,
            bold: true,
            margin: [0, 0, 0, 10]
            },
            table: {
            margin: [0, 5, 0, 15]
            }
        }
        };
        
        let header = ['Item', 'Req. No', 'Beneficiary No.', 'Amount', 'Unit', 'Region', 'Zone', 'Woreda', 'Destination'];
        let tableData: any[] = [];
        let allocationNumber = '';
        let totalQuantity = 0;
        let totalBeneficiaries = 0;
        let unit = '';
        tableData.push(header);
        for(let item of items) {
            allocationNumber = item.reference_no;
            totalQuantity += item.quantity;
            totalBeneficiaries += item.beneficiaries;
            unit = item.unit_abbreviation;

            let result = tableData.find((d:any) => d[0] === item.commodity_name && d[8] === item.destination_name);
            if(result) {
                result[3] = (result[3] + item.quantity).toFixed(2);
            } else {
                tableData.push([item.commodity_name, item.reference_no, item.beneficiaries, item.quantity,
                    item.unit_abbreviation, item.region, item.zone, item.woreda, item.destination_name]);
            }     
        }
        docDefinition.content.push({text: `Allocation for ${planReference}`, style: 'header'});
        this.addTableToPDF(docDefinition, tableData);
        docDefinition.content.push({ text: `Total Amount ${totalQuantity.toFixed(2)} ${unit}`, fontSize: 15 },);
        docDefinition.content.push({ text: `Total Beneficiaries ${totalBeneficiaries}`, fontSize: 15 },)
        pdfMake.createPdf(docDefinition).download(`Allocation-${planReference}.pdf`);
    }

    addTableToPDF(docDefinition: any, body: any) {
        docDefinition.content.push({
          style: 'table',
          table: {
            widths: ['*',  '*', '*', '*', '*', '*', '*', '*', '*'],
            body: body
          }
        });
    }

    printRRDInExcel(requisitionNumber: string, planReference: any) {
        const items: any[] = this.dispatchPlanItemQuery.getAll().filter((rec: any) => rec.reference_no === requisitionNumber);
        if(items) {
            this.exportToExcel(items, requisitionNumber, planReference);
        }    
    }

    exportToExcel(items: any[], requisitionNumber: string, planReference: string) {
        let fileName = `allocation_${requisitionNumber}`;
        let excelData: any[] = [];
        let totalQuantity = 0;
        let totalBeneficiaries = 0;
        let unit = '';
        for(let item of items) {
            totalQuantity += item.quantity;
            totalBeneficiaries += item.beneficiaries;
            unit = item.unit_abbreviation;
            let result = excelData.find((ed:any) => ed.item === item.commodity_name && ed.destination === item.destination_name);
            if(result) {
                result.amount = (result.amount + item.quantity).toFixed(2);
            } else {
                excelData.push({ item: item.commodity_name, requisition_no: item.reference_no,
                    beneficiaries: item.beneficiaries, amount: item.quantity, unit: item.unit_abbreviation,
                    region: item.region, zone: item.zone, woreda: item.woreda, destination: item.destination_name
                });
            }
        }
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([[]]);
        XLSX.utils.sheet_add_aoa(worksheet, [['National Disaster risk management commission']], {origin: 'A1'});
        XLSX.utils.sheet_add_aoa(worksheet, [[` Allocation for ${planReference}`]], {origin: 'A2'});
        XLSX.utils.sheet_add_json(worksheet, excelData, {origin: 'A4'});
        XLSX.utils.sheet_add_aoa(worksheet, [[`Total Amount ${totalQuantity} ${unit}`]], {origin: -1});
        XLSX.utils.sheet_add_aoa(worksheet, [[`Total Beneficiaries ${totalBeneficiaries}`]], {origin: -1});
        const workbook: XLSX.WorkBook = { Sheets: { allocation: worksheet }, SheetNames: ['allocation'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, fileName);
    }
    
    private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }
}
