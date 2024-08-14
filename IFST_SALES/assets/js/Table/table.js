// Selecionando o input de busca corretamente
const search = document.querySelector('.table-search-bar input');
const table_rows = document.querySelectorAll('tbody tr');
const table_headings = document.querySelectorAll('thead th');
const pdf_btn = document.querySelector('#toPDF');
const json_btn = document.querySelector('#toJSON');
const csv_btn = document.querySelector('#toCSV');
const excel_btn = document.querySelector('#toEXCEL');
const customers_table = document.querySelector('table');


// 1. Searching for specific data of HTML table
if (search && table_rows.length > 0) {
    search.addEventListener('input', searchTable);

    function searchTable() {
        const search_data = search.value.toLowerCase();

        table_rows.forEach((row, i) => {
            let table_data = row.textContent.toLowerCase();
            row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
            row.style.setProperty('--delay', i / 25 + 's');
        });

        document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
            visible_row.style.backgroundColor = (i % 2 === 0) ? 'transparent' : '#0000000b';
        });
    }
}

// 2. Sorting | Ordering data of HTML table
if (table_headings.length > 0 && table_rows.length > 0) {
    table_headings.forEach((head, i) => {
        let sort_asc = true;
        head.onclick = () => {
            table_headings.forEach(head => {
                head.classList.remove('active');
                const icon = head.querySelector('.icon-arrow i');
                if (icon) {
                    icon.classList.remove('fa-arrow-down', 'fa-arrow-up');
                    icon.classList.add('fa-arrow-up');
                }
            });

            head.classList.add('active');

            document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
            table_rows.forEach(row => {
                row.querySelectorAll('td')[i].classList.add('active');
            });

            const icon = head.querySelector('.icon-arrow i');
            if (icon) {
                if (sort_asc) {
                    icon.classList.remove('fa-arrow-up');
                    icon.classList.add('fa-arrow-down');
                } else {
                    icon.classList.remove('fa-arrow-down');
                    icon.classList.add('fa-arrow-up');
                }
            }

            sort_asc = !sort_asc;
            sortTable(i, sort_asc);
        };
    });

    function sortTable(column, sort_asc) {
        [...table_rows].sort((a, b) => {
            let first_row = a.querySelectorAll('td')[column].textContent.toLowerCase(),
                second_row = b.querySelectorAll('td')[column].textContent.toLowerCase();

            return sort_asc ? (first_row < second_row ? 1 : -1) : (first_row < second_row ? -1 : 1);
        }).map(sorted_row => document.querySelector('tbody').appendChild(sorted_row));
    }
}

// 3. Converting HTML table to PDF
if (pdf_btn && customers_table) {
    pdf_btn.onclick = (event) => {
        event.stopImmediatePropagation();

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.autoTable({ html: customers_table });

        doc.save('table.pdf');
    };
}

// 4. Converting HTML table to JSON
if (json_btn && customers_table) {
    json_btn.onclick = (event) => {
        event.stopImmediatePropagation();
        const json = toJSON(customers_table);
        downloadFile(json, 'json');
    };

    function toJSON(table) {
        let table_data = [],
            t_head = [],
            t_headings = table.querySelectorAll('th'),
            t_rows = table.querySelectorAll('tbody tr');

        for (let t_heading of t_headings) {
            let actual_head = t_heading.textContent.trim().split(' ');
            t_head.push(actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase());
        }

        t_rows.forEach(row => {
            const row_object = {},
                t_cells = row.querySelectorAll('td');

            t_cells.forEach((t_cell, cell_index) => {
                const img = t_cell.querySelector('img');
                if (img) {
                    row_object['customer image'] = decodeURIComponent(img.src);
                }
                row_object[t_head[cell_index]] = t_cell.textContent.trim();
            });
            table_data.push(row_object);
        });

        return JSON.stringify(table_data, null, 4);
    }
}

// 5. Converting HTML table to CSV File
if (csv_btn && customers_table) {
    csv_btn.onclick = (event) => {
        event.stopImmediatePropagation();
        const csv = toCSV(customers_table);
        downloadFile(csv, 'csv', 'customer orders');
    };

    function toCSV(table) {
        const t_heads = table.querySelectorAll('th'),
            tbody_rows = table.querySelectorAll('tbody tr');

        const headings = [...t_heads].map(head => {
            let actual_head = head.textContent.trim().split(' ');
            return actual_head.splice(0, actual_head.length - 1).join(',').toLowerCase();
        }).join(',') + ',' + 'image name';

        const table_data = [...tbody_rows].map(row => {
            const cells = row.querySelectorAll('td'),
                img = decodeURIComponent(row.querySelector('img').src),
                data_without_img = [...cells].map(cell => cell.textContent.replace(/,/g, ".").trim()).join(',');

            return data_without_img + ',' + img;
        }).join('\n');

        return headings + '\n' + table_data;
    }
}

// 6. Converting HTML table to EXCEL File
if (excel_btn && customers_table) {
    excel_btn.onclick = (event) => {
        event.stopImmediatePropagation();

        const wb = XLSX.utils.table_to_book(customers_table, { sheet: "Sheet1" });
        XLSX.writeFile(wb, "table.xlsx");
    };
}

// Function to download files
function downloadFile(data, fileType, fileName = '') {
    const a = document.createElement('a');
    a.download = fileName;
    const mime_types = {
        'json': 'application/json',
        'csv': 'text/csv',
        'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    a.href = `data:${mime_types[fileType]};charset=utf-8,${encodeURIComponent(data)}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
}
