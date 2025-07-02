// Set up date navigation
let currentDate = new Date();

function formatDateToInput(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function updateJournalDate() {
	const options = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};
	document.getElementById('journal-date').textContent =
		currentDate.toLocaleDateString(undefined, options);
}

document.getElementById('prev-day').onclick = function () {
	const prev = new Date(currentDate);
	prev.setDate(prev.getDate() - 1);
	currentDate = prev;
	updateJournalDate();
};

document.getElementById('next-day').onclick = function () {
	const next = new Date(currentDate);
	next.setDate(next.getDate() + 1);
	currentDate = next;
	updateJournalDate();
};

// Initialize with today's date
currentDate = new Date();
updateJournalDate();

// Add and remove row functionality
const tbody = document.getElementById('meals');
function updateTotals() {
	let carbs = 0,
		protein = 0,
		fats = 0,
		calories = 0;
	const rows = document.querySelectorAll('#meals tr');
	const tfoot = document.getElementById('meals-tfoot');

	if (rows.length > 0) {
		// Calculate totals
		rows.forEach((row) => {
			const cells = row.querySelectorAll('td');
			if (cells.length >= 5) {
				carbs += parseFloat(cells[1].textContent) || 0;
				protein += parseFloat(cells[2].textContent) || 0;
				fats += parseFloat(cells[3].textContent) || 0;
				calories += parseFloat(cells[4].textContent) || 0;
			}
		});
		// Add or update total row
		tfoot.innerHTML = `
                <tr>
                    <th id="total">Total</th>
                    <th id="total-carbs">${carbs}</th>
                    <th id="total-protein">${protein}</th>
                    <th id="total-fats">${fats}</th>
                    <th id="total-calories">${calories}</th>
                    <th></th>
                </tr>
            `;
	} else {
		// Remove total row if no data
		tfoot.innerHTML = '';
	}
}

let pieChartInstance = null;

function updatePieChart() {
	const rows = document.querySelectorAll('#meals tr');
	let totalCarbs = 0;
	let totalProtein = 0;
	let totalFats = 0;
	let totalCalories = 0;

	rows.forEach((row) => {
		const cells = row.querySelectorAll('td');
		if (cells.length >= 5) {
			totalCarbs += parseFloat(cells[1].textContent) || 0;
			totalProtein += parseFloat(cells[2].textContent) || 0;
			totalFats += parseFloat(cells[3].textContent) || 0;
			totalCalories += parseFloat(cells[4].textContent) || 0;
		}
	});

	const ctx = document.getElementById('mealsPieChart').getContext('2d');
	if (pieChartInstance) {
		pieChartInstance.destroy();
	}
	pieChartInstance = new Chart(ctx, {
		type: 'pie',
		data: {
			labels: ['Carbs', 'Protein', 'Fats', 'Calories'],
			datasets: [
				{
					data: [totalCarbs, totalProtein, totalFats, totalCalories],
					backgroundColor: [
						'rgba(111, 66, 193, 0.7)', // Carbs
						'rgba(40, 167, 69, 0.7)', // Protein
						'rgba(255, 193, 7, 0.7)', // Fats
						'rgba(220, 53, 69, 0.7)', // Calories
					],
					borderColor: ['#6f42c1', '#28a745', '#ffc107', '#dc3545'],
					borderWidth: 1,
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				legend: { labels: { color: '#fff' } },
			},
		},
	});
}

// Update pie chart whenever table changes
function updateTotalsAndCharts() {
	updateTotals();
	updatePieChart();
}

document.getElementById('add-row').onclick = function () {
	const tr = document.createElement('tr');
	tr.innerHTML = `
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
			<td contenteditable="true"></td>
			<td contenteditable="true"></td>
            <td><button id="close-button" class="btn btn-sm remove-row">&times;</button></td>
        `;
	tbody.appendChild(tr);
	updateTotalsAndCharts();
};

tbody.addEventListener('click', function (e) {
	if (e.target && e.target.classList.contains('remove-row')) {
		const row = e.target.closest('tr');
		if (row) row.remove();
		updateTotalsAndCharts();
	}
});

tbody.addEventListener('input', function (e) {
	updateTotalsAndCharts();
});

// Initial chart update
updatePieChart();

// Show modal popup when clicking the journal date
document.getElementById('journal-date').onclick = function () {
	document.getElementById('modal-date-picker').value =
		formatDateToInput(currentDate);
	// Use jQuery to show the modal (Bootstrap 4)
	$('#calendarModal').modal('show');
};

// When OK is clicked in the modal, update the date and close modal
document.getElementById('calendar-ok-btn').onclick = function () {
	const val = document.getElementById('modal-date-picker').value;
	if (val) {
		const [year, month, day] = val.split('-');
		currentDate = new Date(year, month - 1, day);
		updateJournalDate();
	}
	$('#calendarModal').modal('hide');
};
