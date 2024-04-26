// Fetch parts data from the server
async function loadTableData() {
  try {
    const response = await fetch('/api/parts');
    const parts = await response.json();

    const table = dataTable.getElementsByTagName('tbody')[0];

    // Clear existing table data
    while (table.rows.length > 0) {
      table.deleteRow(0);
    }

    // Populate table with parts data
    parts.forEach((part) => {
      const newRow = table.insertRow();
      const nameCell = newRow.insertCell();
      nameCell.textContent = part.name;
      const descriptionCell = newRow.insertCell();
      descriptionCell.textContent = part.description;
      const priceCell = newRow.insertCell();
      priceCell.textContent = part.price;
    });
  } catch (err) {
    console.error(err);
  }
}

// Add a new part
addRowBtn.addEventListener('click', async () => {
  const table = dataTable.getElementsByTagName('tbody')[0];
  const newRow = table.insertRow();

  const nameCell = newRow.insertCell();
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameCell.appendChild(nameInput);

  const descriptionCell = newRow.insertCell();
  const descriptionInput = document.createElement('input');
  descriptionInput.type = 'text';
  descriptionCell.appendChild(descriptionInput);

  const priceCell = newRow.insertCell();
  const priceInput = document.createElement('input');
  priceInput.type = 'number';
  priceCell.appendChild(priceInput);

  const saveCell = newRow.insertCell();
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.addEventListener('click', async () => {
    const name = nameInput.value;
    const description = descriptionInput.value;
    const price = priceInput.value;

    try {
      const response = await fetch('/api/parts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, price }),
      });

      const newPart = await response.json();
      console.log('New part:', newPart);
      loadTableData();
    } catch (err) {
      console.error(err);
    }
  });
  saveCell.appendChild(saveBtn);
});

// Delete a part
deleteRowBtn.addEventListener('click', async () => {
  const table = dataTable.getElementsByTagName('tbody')[0];
  const rowCount = table.rows.length;

  if (rowCount > 0) {
    const lastRow = table.rows[rowCount - 1];
    const partId = lastRow.cells[0].textContent;

    try {
      const response = await fetch(`/api/parts/${partId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        table.deleteRow(rowCount - 1);
      } else {
        const error = await response.json();
        console.error(error.error);
      }
    } catch (err) {
      console.error(err);
    }
  }
});
