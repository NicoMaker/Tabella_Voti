document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('csv-file');
    const fileName = document.getElementById('file-name');
    const loadingContainer = document.getElementById('loading-container');
    const dashboard = document.getElementById('dashboard');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    const dataFilter = document.getElementById('data-filter');
    const tableSearch = document.getElementById('table-search');
    const sortSelect = document.getElementById('sort-select');
    const dataTable = document.getElementById('data-table');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const modal = document.getElementById('detail-modal');
    const closeModal = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    // Stats elements
    const totalRecordsEl = document.getElementById('total-records');
    const totalCategoriesEl = document.getElementById('total-categories');
    const averageScoreEl = document.getElementById('average-score');
    
    // Chart elements
    const categoryChart = document.getElementById('category-chart');
    const trendChart = document.getElementById('trend-chart');
    const breakdownChart = document.getElementById('breakdown-chart');
    
    // State variables
    let csvData = [];
    let headers = [];
    let currentPage = 1;
    let rowsPerPage = 10;
    let filteredData = [];
    let sortColumn = '';
    let sortDirection = 'asc';
    let charts = {};
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
    
    // Event Listeners
    fileInput.addEventListener('change', handleFileUpload);
    themeToggleBtn.addEventListener('click', toggleTheme);
    dataFilter.addEventListener('change', filterData);
    tableSearch.addEventListener('input', searchData);
    sortSelect.addEventListener('change', sortData);
    prevPageBtn.addEventListener('click', () => changePage(-1));
    nextPageBtn.addEventListener('click', () => changePage(1));
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
    
    // Theme toggle function
    function toggleTheme() {
      document.body.classList.toggle('dark-theme');
      
      if (document.body.classList.contains('dark-theme')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
      } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
      }
      
      // Update charts if they exist
      updateChartsTheme();
    }
    
    // Handle file upload
    function handleFileUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      fileName.textContent = file.name;
      loadingContainer.style.display = 'flex';
      dashboard.style.display = 'none';
      
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
          setTimeout(() => {
            processData(results.data, results.meta.fields);
            loadingContainer.style.display = 'none';
            dashboard.style.display = 'block';
          }, 1000); // Simulate processing time for better UX
        },
        error: function(error) {
          console.error('Error parsing CSV:', error);
          loadingContainer.style.display = 'none';
          alert('Error parsing CSV file. Please check the file format and try again.');
        }
      });
    }
    
    // Process CSV data
    function processData(data, fields) {
      csvData = data.filter(row => Object.values(row).some(val => val !== null && val !== ''));
      headers = fields;
      filteredData = [...csvData];
      
      // Update filter options
      updateFilterOptions();
      
      // Update sort options
      updateSortOptions();
      
      // Update stats
      updateStats();
      
      // Render table
      renderTable();
      
      // Create charts
      createCharts();
    }
    
    // Update filter options
    function updateFilterOptions() {
      // Clear existing options except "All Data"
      while (dataFilter.options.length > 1) {
        dataFilter.remove(1);
      }
      
      // Get unique categories from data
      const categories = getUniqueCategories();
      
      // Add options for each category
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        dataFilter.appendChild(option);
      });
    }
    
    // Get unique categories from data
    function getUniqueCategories() {
      // Assuming the first column might contain category information
      // Adjust this logic based on your actual data structure
      const categoryColumn = headers[0];
      const categories = new Set();
      
      csvData.forEach(row => {
        if (row[categoryColumn]) {
          categories.add(row[categoryColumn]);
        }
      });
      
      return Array.from(categories);
    }
    
    // Update sort options
    function updateSortOptions() {
      // Clear existing options except "Default"
      while (sortSelect.options.length > 1) {
        sortSelect.remove(1);
      }
      
      // Add options for each header
      headers.forEach(header => {
        const option = document.createElement('option');
        option.value = header;
        option.textContent = header;
        sortSelect.appendChild(option);
      });
    }
    
    // Update statistics
    function updateStats() {
      // Total records
      totalRecordsEl.textContent = csvData.length;
      
      // Total categories
      const categories = getUniqueCategories();
      totalCategoriesEl.textContent = categories.length;
      
      // Average score (assuming there's a numeric column that represents scores)
      // Adjust this logic based on your actual data structure
      let numericColumns = headers.filter(header => {
        return csvData.some(row => typeof row[header] === 'number');
      });
      
      if (numericColumns.length > 0) {
        // Use the first numeric column as the score column
        const scoreColumn = numericColumns[0];
        
        const scores = csvData
          .map(row => row[scoreColumn])
          .filter(score => typeof score === 'number');
        
        if (scores.length > 0) {
          const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
          averageScoreEl.textContent = avgScore.toFixed(2);
        } else {
          averageScoreEl.textContent = 'N/A';
        }
      } else {
        averageScoreEl.textContent = 'N/A';
      }
    }
    
    // Filter data based on selected category
    function filterData() {
      const filterValue = dataFilter.value;
      
      if (filterValue === 'all') {
        filteredData = [...csvData];
      } else {
        // Assuming the first column contains category information
        // Adjust this logic based on your actual data structure
        const categoryColumn = headers[0];
        
        filteredData = csvData.filter(row => row[categoryColumn] === filterValue);
      }
      
      currentPage = 1;
      renderTable();
      updateCharts();
    }
    
    // Search data
    function searchData() {
      const searchTerm = tableSearch.value.toLowerCase();
      
      if (searchTerm === '') {
        filterData(); // Reset to current filter
        return;
      }
      
      // Filter based on current filter first
      const filterValue = dataFilter.value;
      let baseData;
      
      if (filterValue === 'all') {
        baseData = [...csvData];
      } else {
        const categoryColumn = headers[0];
        baseData = csvData.filter(row => row[categoryColumn] === filterValue);
      }
      
      // Then search within that filtered data
      filteredData = baseData.filter(row => {
        return Object.values(row).some(value => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchTerm);
        });
      });
      
      currentPage = 1;
      renderTable();
    }
    
    // Sort data
    function sortData() {
      const column = sortSelect.value;
      
      if (column === 'default') {
        // Reset sort
        sortColumn = '';
        filteredData = [...filteredData]; // Create a new array reference to trigger re-render
      } else {
        if (sortColumn === column) {
          // Toggle direction if same column
          sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          sortColumn = column;
          sortDirection = 'asc';
        }
        
        filteredData.sort((a, b) => {
          const valueA = a[column];
          const valueB = b[column];
          
          // Handle null/undefined values
          if (valueA === null || valueA === undefined) return sortDirection === 'asc' ? 1 : -1;
          if (valueB === null || valueB === undefined) return sortDirection === 'asc' ? -1 : 1;
          
          // Compare based on type
          if (typeof valueA === 'number' && typeof valueB === 'number') {
            return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
          } else {
            const strA = String(valueA).toLowerCase();
            const strB = String(valueB).toLowerCase();
            return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
          }
        });
      }
      
      renderTable();
    }
    
    // Render table with pagination
    function renderTable() {
      // Clear existing table
      const thead = dataTable.querySelector('thead');
      const tbody = dataTable.querySelector('tbody');
      thead.innerHTML = '';
      tbody.innerHTML = '';
      
      // Create header row
      const headerRow = document.createElement('tr');
      headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        
        // Add sort indicator if this is the sorted column
        if (header === sortColumn) {
          th.classList.add(sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
        }
        
        // Add click event for sorting
        th.addEventListener('click', () => {
          sortSelect.value = header;
          sortData();
        });
        
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      
      // Calculate pagination
      const totalPages = Math.ceil(filteredData.length / rowsPerPage);
      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);
      
      // Create rows for current page
      for (let i = startIndex; i < endIndex; i++) {
        const row = filteredData[i];
        const tr = document.createElement('tr');
        
        headers.forEach(header => {
          const td = document.createElement('td');
          td.textContent = row[header] !== null && row[header] !== undefined ? row[header] : 'N/A';
          tr.appendChild(td);
        });
        
        // Add click event to show detail modal
        tr.addEventListener('click', () => showDetailModal(row));
        
        tbody.appendChild(tr);
      }
      
      // Update pagination controls
      updatePagination(totalPages);
    }
    
    // Update pagination controls
    function updatePagination(totalPages) {
      pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
      
      prevPageBtn.disabled = currentPage <= 1;
      nextPageBtn.disabled = currentPage >= totalPages;
    }
    
    // Change page
    function changePage(delta) {
      currentPage += delta;
      renderTable();
      
      // Scroll to top of table
      dataTable.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Show detail modal for a row
    function showDetailModal(row) {
      modalTitle.textContent = 'Detailed View';
      modalBody.innerHTML = '';
      
      // Create detail content
      const detailTable = document.createElement('table');
      detailTable.className = 'detail-table';
      
      headers.forEach(header => {
        const tr = document.createElement('tr');
        
        const th = document.createElement('th');
        th.textContent = header;
        tr.appendChild(th);
        
        const td = document.createElement('td');
        td.textContent = row[header] !== null && row[header] !== undefined ? row[header] : 'N/A';
        tr.appendChild(td);
        
        detailTable.appendChild(tr);
      });
      
      modalBody.appendChild(detailTable);
      
      // Show modal
      modal.style.display = 'flex';
    }
    
    // Create charts
    function createCharts() {
      // Destroy existing charts if they exist
      if (charts.categoryChart) charts.categoryChart.destroy();
      if (charts.trendChart) charts.trendChart.destroy();
      if (charts.breakdownChart) charts.breakdownChart.destroy();
      
      // Get chart data
      const chartData = prepareChartData();
      
      // Create category distribution chart
      charts.categoryChart = new Chart(categoryChart, {
        type: 'pie',
        data: {
          labels: chartData.categories.map(cat => cat.name),
          datasets: [{
            data: chartData.categories.map(cat => cat.count),
            backgroundColor: generateColors(chartData.categories.length),
            borderWidth: 1,
            borderColor: getComputedStyle(document.body).getPropertyValue('--bg-primary')
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: getComputedStyle(document.body).getPropertyValue('--text-primary')
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
      
      // Create trend chart
      charts.trendChart = new Chart(trendChart, {
        type: 'line',
        data: {
          labels: chartData.trends.labels,
          datasets: [{
            label: 'Trend',
            data: chartData.trends.data,
            borderColor: getComputedStyle(document.body).getPropertyValue('--primary-color'),
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                color: getComputedStyle(document.body).getPropertyValue('--border-color')
              },
              ticks: {
                color: getComputedStyle(document.body).getPropertyValue('--text-secondary')
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: getComputedStyle(document.body).getPropertyValue('--border-color')
              },
              ticks: {
                color: getComputedStyle(document.body).getPropertyValue('--text-secondary')
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: getComputedStyle(document.body).getPropertyValue('--text-primary')
              }
            }
          },
          animation: {
            duration: 2000,
            easing: 'easeOutQuart'
          }
        }
      });
      
      // Create breakdown chart
      charts.breakdownChart = new Chart(breakdownChart, {
        type: 'bar',
        data: {
          labels: chartData.breakdown.labels,
          datasets: [{
            label: 'Values',
            data: chartData.breakdown.data,
            backgroundColor: generateColors(chartData.breakdown.labels.length),
            borderWidth: 1,
            borderColor: getComputedStyle(document.body).getPropertyValue('--bg-primary')
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: getComputedStyle(document.body).getPropertyValue('--text-secondary')
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: getComputedStyle(document.body).getPropertyValue('--border-color')
              },
              ticks: {
                color: getComputedStyle(document.body).getPropertyValue('--text-secondary')
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          },
          animation: {
            delay: function(context) {
              return context.dataIndex * 100;
            },
            duration: 1000,
            easing: 'easeOutQuart'
          }
        }
      });
    }
    
    // Update charts when data changes
    function updateCharts() {
      const chartData = prepareChartData();
      
      // Update category chart
      if (charts.categoryChart) {
        charts.categoryChart.data.labels = chartData.categories.map(cat => cat.name);
        charts.categoryChart.data.datasets[0].data = chartData.categories.map(cat => cat.count);
        charts.categoryChart.data.datasets[0].backgroundColor = generateColors(chartData.categories.length);
        charts.categoryChart.update();
      }
      
      // Update trend chart
      if (charts.trendChart) {
        charts.trendChart.data.labels = chartData.trends.labels;
        charts.trendChart.data.datasets[0].data = chartData.trends.data;
        charts.trendChart.update();
      }
      
      // Update breakdown chart
      if (charts.breakdownChart) {
        charts.breakdownChart.data.labels = chartData.breakdown.labels;
        charts.breakdownChart.data.datasets[0].data = chartData.breakdown.data;
        charts.breakdownChart.data.datasets[0].backgroundColor = generateColors(chartData.breakdown.labels.length);
        charts.breakdownChart.update();
      }
    }
    
    // Update charts theme when theme changes
    function updateChartsTheme() {
      if (!charts.categoryChart) return;
      
      const textColor = getComputedStyle(document.body).getPropertyValue('--text-primary');
      const borderColor = getComputedStyle(document.body).getPropertyValue('--border-color');
      const secondaryTextColor = getComputedStyle(document.body).getPropertyValue('--text-secondary');
      
      // Update category chart
      charts.categoryChart.options.plugins.legend.labels.color = textColor;
      charts.categoryChart.data.datasets[0].borderColor = getComputedStyle(document.body).getPropertyValue('--bg-primary');
      charts.categoryChart.update();
      
      // Update trend chart
      charts.trendChart.options.scales.x.grid.color = borderColor;
      charts.trendChart.options.scales.y.grid.color = borderColor;
      charts.trendChart.options.scales.x.ticks.color = secondaryTextColor;
      charts.trendChart.options.scales.y.ticks.color = secondaryTextColor;
      charts.trendChart.options.plugins.legend.labels.color = textColor;
      charts.trendChart.data.datasets[0].borderColor = getComputedStyle(document.body).getPropertyValue('--primary-color');
      charts.trendChart.update();
      
      // Update breakdown chart
      charts.breakdownChart.options.scales.x.ticks.color = secondaryTextColor;
      charts.breakdownChart.options.scales.y.ticks.color = secondaryTextColor;
      charts.breakdownChart.options.scales.y.grid.color = borderColor;
      charts.breakdownChart.data.datasets[0].borderColor = getComputedStyle(document.body).getPropertyValue('--bg-primary');
      charts.breakdownChart.update();
    }
    
    // Prepare data for charts
    function prepareChartData() {
      // For category distribution chart
      const categoryColumn = headers[0]; // Assuming first column is category
      const categoryMap = {};
      
      filteredData.forEach(row => {
        const category = row[categoryColumn] || 'Unknown';
        categoryMap[category] = (categoryMap[category] || 0) + 1;
      });
      
      const categories = Object.keys(categoryMap).map(name => ({
        name,
        count: categoryMap[name]
      }));
      
      // For trend chart - use numeric columns
      let numericColumns = headers.filter(header => {
        return filteredData.some(row => typeof row[header] === 'number');
      });
      
      let trendData = {
        labels: [],
        data: []
      };
      
      if (numericColumns.length > 0) {
        // Use the first numeric column for trend
        const valueColumn = numericColumns[0];
        
        // Group by another column if available, otherwise use index
        const groupColumn = headers.find(h => h !== valueColumn && typeof filteredData[0]?.[h] === 'string') || 'index';
        
        const groupedData = {};
        
        filteredData.forEach((row, index) => {
          const groupKey = groupColumn === 'index' ? index : row[groupColumn];
          const value = row[valueColumn];
          
          if (typeof value === 'number') {
            groupedData[groupKey] = value;
          }
        });
        
        // Sort by group key if it's not index
        const sortedKeys = Object.keys(groupedData).sort((a, b) => {
          if (groupColumn === 'index') {
            return parseInt(a) - parseInt(b);
          }
          return a.localeCompare(b);
        });
        
        trendData.labels = sortedKeys.map(key => groupColumn === 'index' ? `Item ${parseInt(key) + 1}` : key);
        trendData.data = sortedKeys.map(key => groupedData[key]);
      }
      
      // For breakdown chart - use another dimension
      let breakdownData = {
        labels: [],
        data: []
      };
      
      // Find a suitable column for breakdown
      const breakdownColumn = headers.find(h => 
        h !== categoryColumn && 
        h !== numericColumns[0] && 
        filteredData.some(row => row[h] !== null && row[h] !== undefined)
      ) || headers[1];
      
      if (breakdownColumn) {
        const breakdownMap = {};
        
        filteredData.forEach(row => {
          const key = row[breakdownColumn] || 'Unknown';
          
          // If we have a numeric column, use it for values
          if (numericColumns.length > 0) {
            const value = row[numericColumns[0]];
            if (typeof value === 'number') {
              breakdownMap[key] = (breakdownMap[key] || 0) + value;
            }
          } else {
            // Otherwise just count occurrences
            breakdownMap[key] = (breakdownMap[key] || 0) + 1;
          }
        });
        
        // Sort by value
        const sortedKeys = Object.keys(breakdownMap).sort((a, b) => breakdownMap[b] - breakdownMap[a]);
        
        // Limit to top 10 for readability
        const topKeys = sortedKeys.slice(0, 10);
        
        breakdownData.labels = topKeys;
        breakdownData.data = topKeys.map(key => breakdownMap[key]);
      }
      
      return {
        categories,
        trends: trendData,
        breakdown: breakdownData
      };
    }
    
    // Generate colors for charts
    function generateColors(count) {
      const baseColors = [
        'rgba(99, 102, 241, 0.8)',   // Primary
        'rgba(16, 185, 129, 0.8)',   // Secondary
        'rgba(245, 158, 11, 0.8)',   // Accent
        'rgba(239, 68, 68, 0.8)',    // Red
        'rgba(59, 130, 246, 0.8)',   // Blue
        'rgba(139, 92, 246, 0.8)',   // Purple
        'rgba(236, 72, 153, 0.8)',   // Pink
        'rgba(34, 197, 94, 0.8)',    // Green
        'rgba(234, 179, 8, 0.8)',    // Yellow
        'rgba(14, 165, 233, 0.8)'    // Sky
      ];
      
      // If we need more colors than in our base set, generate them
      if (count <= baseColors.length) {
        return baseColors.slice(0, count);
      }
      
      const colors = [...baseColors];
      
      // Generate additional colors with varying opacity
      for (let i = baseColors.length; i < count; i++) {
        const baseColor = baseColors[i % baseColors.length];
        const opacity = 0.4 + (0.4 * (i / count));
        colors.push(baseColor.replace(/[\d.]+\)$/, `${opacity})`));
      }
      
      return colors;
    }
    
    // Initialize with sample data if needed for demo purposes
    function initWithSampleData() {
      // This function could be used to load sample data for demonstration
      // when no file is uploaded
    }
  });