document.addEventListener("DOMContentLoaded", init);
let sortingState = {
  currentStep: 0,
  sepalSort: "species",
  petalSort: "species",
};
async function init() {
  // Iris dataset
  const irisData = await d3.csv("iris.csv", (d) => ({
    sepalLength: +d.sepal_length,
    sepalWidth: +d.sepal_width,
    petalLength: +d.petal_length,
    petalWidth: +d.petal_width,
    species: d.species,
  }));

  // Visualization setup
  const margin = { top: 20, right: 100, bottom: 60, left: 60 };
  const width = 600 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svg = d3
    .select("#visualization")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Color scale
  const colorScale = d3
    .scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica"])
    .range(["#e74c3c", "#2ecc71", "#3498db"]);

  // Scales
  let xScale = d3.scaleLinear().range([0, width]);
  let yScale = d3.scaleLinear().range([height, 0]);

  // Axes
  const xAxis = g
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height})`);

  const yAxis = g.append("g").attr("class", "axis y-axis");

  // Grid
  const xGrid = g
    .append("g")
    .attr("class", "grid")
    .attr("transform", `translate(0,${height})`);

  const yGrid = g.append("g").attr("class", "grid");

  // Labels
  const xLabel = g
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + 50)
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#333");

  const yLabel = g
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -40)
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#333");

  // Legend
  const legend = g
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width + 20}, 20)`);

  // Tooltip
  const tooltip = d3.select("#tooltip");

  // Current step
  let currentStep = 0;
  const steps = document.querySelectorAll(".step");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // Step functions
  const stepFunctions = [
    showIntroduction,
    showAllData,
    revealSpecies,
    showPetalView,
    showInsights,
    showMeanStatistics,
    showMedianStatistics,
  ];

  // Initialize
  updateVisualization();

  // Event listeners
  steps.forEach((step, index) => {
    step.addEventListener("click", () => {
      currentStep = index;
      updateVisualization();
    });
  });

  prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      updateVisualization();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentStep < stepFunctions.length - 1) {
      currentStep++;
      updateVisualization();
    }
  });

  function updateVisualization() {
    // Update active step
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
    });

    // Update button states
    prevBtn.disabled = currentStep === 0;
    nextBtn.disabled = currentStep === stepFunctions.length - 1;

    const activeStep = document.querySelector(".step.active");
    if (activeStep) {
      activeStep.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    // Clear all elements before each transition to prevent overlap
    g.selectAll(".dot").remove();
    g.selectAll(".legend-item").remove();
    g.selectAll(".welcome-text").remove();
    g.selectAll(".welcome-subtext").remove();
    g.selectAll(".cluster-annotation").remove();

    g.selectAll(".bar").remove();
    g.selectAll(".sepal-bar").remove();
    g.selectAll(".petal-bar").remove();
    g.selectAll(".bar-label").remove();
    g.selectAll(".sepal-label").remove();
    g.selectAll(".petal-label").remove();
    g.selectAll(".chart-title").remove();
    g.selectAll(".sepal-chart").remove();
    g.selectAll(".petal-chart").remove();
    g.selectAll(".y-axis-label").remove();
    if (currentStep === 0) {
      xAxis.selectAll("*").remove();
      yAxis.selectAll("*").remove();
      xGrid.selectAll("*").remove();
      yGrid.selectAll("*").remove();
      xLabel.text("");
      yLabel.text("");
      g.selectAll(".legend-item").remove();
    } else {
      g.selectAll(".legend-item").remove();
    }
    // Run step function
    stepFunctions[currentStep]();
  }

  function showIntroduction() {
    const xStart = 40; // left margin

    // Show welcome message
    const welcomeText = g
      .append("text")
      .attr("class", "welcome-text")
      .attr("x", xStart)
      .attr("y", 40)
      .style("text-anchor", "start") // LEFT align
      .style("font-size", "24px")
      .style("fill", "#333")
      .style("font-weight", "bold")
      .text("🌸 Welcome to the Iris Dataset!");

    const subText = g
      .append("text")
      .attr("class", "welcome-subtext")
      .attr("x", xStart)
      .attr("y", 100)
      .style("text-anchor", "start") // LEFT align
      .style("font-size", "16px")
      .style("fill", "#666");

    subText
      .append("tspan")
      .attr("x", xStart)
      .attr("dy", 0)
      .text("The Iris dataset is one of the most well-known datasets");

    subText
      .append("tspan")
      .attr("x", xStart)
      .attr("dy", "1.2em")
      .text("used in machine learning and data analysis today! It was");

    subText
      .append("tspan")
      .attr("x", xStart)
      .attr("dy", "1.2em")
      .text("first introduced by Ronald A. Fisher in 1936 when");

    subText
      .append("tspan")
      .attr("x", xStart)
      .attr("dy", "1.2em")
      .text("biologists at that time had questions about whether species");

    subText
      .append("tspan")
      .attr("x", xStart)
      .attr("dy", "1.2em")
      .text("could be classified based on physical characteristics.");

    subText
      .append("tspan")
      .attr("x", xStart)
      .attr("dy", "1.2em")
      .text("He developed a method called linear discriminant analysis");

    subText
      .append("tspan")
      .attr("x", xStart)
      .attr("dy", "1.2em")
      .text("to show that species could be classified by statistical");

    subText
      .append("tspan")
      .attr("x", xStart)
      .attr("dy", "1.2em")
      .text("measurements. There are 150 samples of the iris flower");

    subText
      .append("tspan")
      .attr("x", xStart)
      .attr("dy", "1.2em")
      .text("divided into 3 species-- setosa, virginica, and versicolor.");

    subText
      .append("tspan")
      .attr("x", xStart)
      .attr("dy", "1.2em")
      .text("Click Next or Previous to view the entire slideshow.");
  }

  function showAllData() {
    // Set up sepal dimensions
    xScale.domain(d3.extent(irisData, (d) => d.sepalLength)).nice();
    yScale.domain(d3.extent(irisData, (d) => d.sepalWidth)).nice();

    // Update axes with transition
    xAxis.transition().duration(800).call(d3.axisBottom(xScale));

    yAxis.transition().duration(800).call(d3.axisLeft(yScale));

    // Add grid with transition
    xGrid
      .transition()
      .duration(800)
      .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(""));

    yGrid
      .transition()
      .duration(800)
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""));

    // Update labels with fade in
    xLabel
      .style("opacity", 0)
      .text("Sepal Length (cm)")
      .transition()
      .duration(600)
      .delay(400)
      .style("opacity", 1);
    yLabel
      .style("opacity", 0)
      .text("Sepal Width (cm)")
      .transition()
      .duration(600)
      .delay(400)
      .style("opacity", 1);

    // Add dots with staggered entrance animation
    g.selectAll(".dot")
      .data(irisData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 0)
      .attr("cx", (d) => xScale(d.sepalLength))
      .attr("cy", (d) => yScale(d.sepalWidth))
      .style("fill", "#1daf15ff")
      .style("stroke", "#1daf15ff")
      .style("stroke-width", 1)
      .style("opacity", 0)
      .on("mouseover", showTooltip)
      .on("mouseout", hideTooltip)
      .transition()
      .duration(400)
      .delay((d, i) => i * 8 + 600)
      .attr("r", 5)
      .style("opacity", 0.8);
  }

  function revealSpecies() {
    // Set up sepal dimensions (same as showAllData)
    xScale.domain(d3.extent(irisData, (d) => d.sepalLength)).nice();
    yScale.domain(d3.extent(irisData, (d) => d.sepalWidth)).nice();

    // Update axes
    xAxis.call(d3.axisBottom(xScale));
    yAxis.call(d3.axisLeft(yScale));

    // Add grid
    xGrid.call(d3.axisBottom(xScale).tickSize(-height).tickFormat(""));

    yGrid.call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""));

    // Update labels
    xLabel.text("Sepal Length (cm)");
    yLabel.text("Sepal Width (cm)");

    // Add dots starting gray, then transition to species colors
    g.selectAll(".dot")
      .data(irisData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", (d) => xScale(d.sepalLength))
      .attr("cy", (d) => yScale(d.sepalWidth))
      .style("fill", "#1daf15ff")
      .style("stroke", "#1daf15ff")
      .style("stroke-width", 1)
      .style("opacity", 0.8)
      .on("mouseover", showTooltip)
      .on("mouseout", hideTooltip)
      .transition()
      .duration(800)
      .delay((d, i) => i * 6 + 300)
      .style("fill", (d) => colorScale(d.species))
      .style("stroke", "#fff")
      .attr("r", 6);

    // Add legend with staggered entrance
    const legendData = ["setosa", "versicolor", "virginica"];
    const legendItems = legend
      .selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`)
      .style("opacity", 0);

    legendItems
      .append("circle")
      .attr("r", 6)
      .style("fill", (d) => colorScale(d));

    legendItems
      .append("text")
      .attr("x", 15)
      .attr("y", 5)
      .text((d) => d.charAt(0).toUpperCase() + d.slice(1))
      .style("font-size", "14px")
      .style("fill", "#333");

    // Animate legend items
    legendItems
      .transition()
      .duration(600)
      .delay((d, i) => i * 200 + 1500)
      .style("opacity", 1);
  }

  function showPetalView() {
    // Update scales for petal dimensions
    xScale.domain(d3.extent(irisData, (d) => d.petalLength)).nice();
    yScale.domain(d3.extent(irisData, (d) => d.petalWidth)).nice();

    // Update axes with smooth transition
    xAxis.transition().duration(1000).call(d3.axisBottom(xScale));

    yAxis.transition().duration(1000).call(d3.axisLeft(yScale));

    // Update grid with transition
    xGrid
      .transition()
      .duration(1000)
      .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(""));

    yGrid
      .transition()
      .duration(1000)
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""));

    // Update labels with fade transition
    xLabel
      .transition()
      .duration(500)
      .style("opacity", 0)
      .transition()
      .duration(500)
      .delay(500)
      .text("Petal Length (cm)")
      .style("opacity", 1);
    yLabel
      .transition()
      .duration(500)
      .style("opacity", 0)
      .transition()
      .duration(500)
      .delay(500)
      .text("Petal Width (cm)")
      .style("opacity", 1);

    // Add dots starting at sepal positions, then animate to petal positions
    const dots = g
      .selectAll(".dot")
      .data(irisData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 6)
      .attr("cx", (d) =>
        xScale.range([0, width])(
          d3
            .scaleLinear()
            .domain(d3.extent(irisData, (d) => d.sepalLength))
            .nice()(d.sepalLength)
        )
      )
      .attr("cy", (d) =>
        yScale.range([height, 0])(
          d3
            .scaleLinear()
            .domain(d3.extent(irisData, (d) => d.sepalWidth))
            .nice()(d.sepalWidth)
        )
      )
      .style("fill", (d) => colorScale(d.species))
      .style("stroke", "#fff")
      .style("stroke-width", 1)
      .style("opacity", 0.8)
      .on("mouseover", showTooltip)
      .on("mouseout", hideTooltip);

    // Animate dots to petal positions with staggered timing
    dots
      .transition()
      .duration(1200)
      .delay((d, i) => i * 4 + 800)
      .attr("cx", (d) => xScale(d.petalLength))
      .attr("cy", (d) => yScale(d.petalWidth))
      .attr("r", 7)
      .style("stroke-width", 1.5);

    // Add legend
    const legendData = ["setosa", "versicolor", "virginica"];
    const legendItems = legend
      .selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`);

    legendItems
      .append("circle")
      .attr("r", 6)
      .style("fill", (d) => colorScale(d));

    legendItems
      .append("text")
      .attr("x", 15)
      .attr("y", 5)
      .text((d) => d.charAt(0).toUpperCase() + d.slice(1))
      .style("font-size", "14px")
      .style("fill", "#333");
  }

  function showInsights() {
    // Update scales for petal dimensions (same as showPetalView)
    xScale.domain(d3.extent(irisData, (d) => d.petalLength)).nice();
    yScale.domain(d3.extent(irisData, (d) => d.petalWidth)).nice();

    // Update axes
    xAxis.call(d3.axisBottom(xScale));
    yAxis.call(d3.axisLeft(yScale));

    // Update grid
    xGrid.call(d3.axisBottom(xScale).tickSize(-height).tickFormat(""));

    yGrid.call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""));

    // Update labels
    xLabel.text("Petal Length (cm)");
    yLabel.text("Petal Width (cm)");

    // Add dots with pulsing animation for emphasis
    g.selectAll(".dot")
      .data(irisData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 7)
      .attr("cx", (d) => xScale(d.petalLength))
      .attr("cy", (d) => yScale(d.petalWidth))
      .style("fill", (d) => colorScale(d.species))
      .style("stroke", "#fff")
      .style("stroke-width", 1)
      .style("opacity", 0.8)
      .on("mouseover", showTooltip)
      .on("mouseout", hideTooltip)
      .transition()
      .duration(600)
      .delay((d, i) => i * 3 + 200)
      .attr("r", 8)
      .style("stroke-width", 2)
      .transition()
      .duration(400)
      .attr("r", 9)
      .transition()
      .duration(400)
      .attr("r", 8);

    // Add legend
    // Add interactive legend with click-to-focus
    const legendData = ["setosa", "versicolor", "virginica"];
    const legendItems = legend
      .selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`);

    legendItems
      .append("circle")
      .attr("r", 6)
      .style("fill", (d) => colorScale(d));

    legendItems
      .append("text")
      .attr("x", 15)
      .attr("y", 5)
      .text((d) => d.charAt(0).toUpperCase() + d.slice(1))
      .style("font-size", "14px")
      .style("fill", "#333");

    // Add subtle cluster highlighting
    setTimeout(() => {
      // Group dots by species and add subtle glow effect
      const species = ["setosa", "versicolor", "virginica"];
      species.forEach((spec, index) => {
        setTimeout(() => {
          g.selectAll(".dot")
            .filter((d) => d.species === spec)
            .transition()
            .duration(800)
            .style("filter", "drop-shadow(0 0 8px " + colorScale(spec) + ")")
            .transition()
            .duration(800)
            .style("filter", "none");
        }, index * 600);
      });
    }, 1000);
  }

  function showMeanStatistics() {
    xAxis.selectAll("*").remove();
    yAxis.selectAll("*").remove();
    xGrid.selectAll("*").remove();
    yGrid.selectAll("*").remove();
    xLabel.text("");
    yLabel.text("");
    // Calculate averages by species
    const species = ["setosa", "versicolor", "virginica"];

    const sepalStats = species.map((spec) => {
      const speciesData = irisData.filter((d) => d.species === spec);
      return {
        species: spec,
        length: d3.mean(speciesData, (d) => d.sepalLength),
        width: d3.mean(speciesData, (d) => d.sepalWidth),
      };
    });

    const petalStats = species.map((spec) => {
      const speciesData = irisData.filter((d) => d.species === spec);
      return {
        species: spec,
        length: d3.mean(speciesData, (d) => d.petalLength),
        width: d3.mean(speciesData, (d) => d.petalWidth),
      };
    });

    // Create two chart areas
    const chartWidth = (width - 40) / 2; // 40px gap between charts
    const chartHeight = height - 80; // Leave space for titles

    // Create groups for each chart
    const sepalChart = g
      .append("g")
      .attr("class", "sepal-chart")
      .attr("transform", "translate(0, 40)");

    const petalChart = g
      .append("g")
      .attr("class", "petal-chart")
      .attr("transform", `translate(${chartWidth + 40}, 40)`);

    // Add chart titles
    g.append("text")
      .attr("class", "chart-title")
      .attr("x", chartWidth / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text("Average Sepal Length");

    g.append("text")
      .attr("class", "chart-title")
      .attr("x", chartWidth + 40 + chartWidth / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text("Average Petal Length");

    // Create scales for sepal chart
    const sepalXScale = d3
      .scaleBand()
      .domain(species)
      .range([0, chartWidth])
      .padding(0.3);

    const sepalYScale = d3
      .scaleLinear()
      .domain([0, d3.max(sepalStats, (d) => d.length)])
      .nice()
      .range([chartHeight, 0]);

    // Create scales for petal chart
    const petalXScale = d3
      .scaleBand()
      .domain(species)
      .range([0, chartWidth])
      .padding(0.3);

    const petalYScale = d3
      .scaleLinear()
      .domain([0, d3.max(petalStats, (d) => d.length)])
      .nice()
      .range([chartHeight, 0]);

    // Add axes for sepal chart
    sepalChart
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(
        d3
          .axisBottom(sepalXScale)
          .tickFormat((d) => d.charAt(0).toUpperCase() + d.slice(1))
      );

    sepalChart
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(sepalYScale));

    // Add axes for petal chart
    petalChart
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(
        d3
          .axisBottom(petalXScale)
          .tickFormat((d) => d.charAt(0).toUpperCase() + d.slice(1))
      );

    petalChart
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(petalYScale));

    // Use the same color scale as the scatter plots
    const speciesColorScale = d3
      .scaleOrdinal()
      .domain(["setosa", "versicolor", "virginica"])
      .range(["#e74c3c", "#2ecc71", "#3498db"]);

    // Create sepal bars
    const sepalBars = sepalChart
      .selectAll(".sepal-bar")
      .data(sepalStats)
      .enter()
      .append("rect")
      .attr("class", "sepal-bar bar")
      .attr("x", (d) => sepalXScale(d.species))
      .attr("width", sepalXScale.bandwidth())
      .attr("y", chartHeight)
      .attr("height", 0)
      .style("fill", (d) => speciesColorScale(d.species))
      .style("opacity", 0.8)
      .style("stroke", "#fff")
      .style("stroke-width", 2)
      .on("mouseover", function (event, d) {
        tooltip
          .style("display", "block")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px")
          .html(
            `<strong>${
              d.species.charAt(0).toUpperCase() + d.species.slice(1)
            }</strong><br>Avg Sepal Length: ${d.length.toFixed(
              2
            )} cm<br>Avg Sepal Width: ${d.width.toFixed(2)} cm`
          );
      })
      .on("mouseout", hideTooltip);

    // Create petal bars
    const petalBars = petalChart
      .selectAll(".petal-bar")
      .data(petalStats)
      .enter()
      .append("rect")
      .attr("class", "petal-bar bar")
      .attr("x", (d) => petalXScale(d.species))
      .attr("width", petalXScale.bandwidth())
      .attr("y", chartHeight)
      .attr("height", 0)
      .style("fill", (d) => speciesColorScale(d.species))
      .style("opacity", 0.8)
      .style("stroke", "#fff")
      .style("stroke-width", 2)
      .on("mouseover", function (event, d) {
        tooltip
          .style("display", "block")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px")
          .html(
            `<strong>${
              d.species.charAt(0).toUpperCase() + d.species.slice(1)
            }</strong><br>Avg Petal Length: ${d.length.toFixed(
              2
            )} cm<br>Avg Petal Width: ${d.width.toFixed(2)} cm`
          );
      })
      .on("mouseout", hideTooltip);

    // Animate sepal bars
    sepalBars
      .transition()
      .duration(800)
      .delay((d, i) => i * 200)
      .attr("y", (d) => sepalYScale(d.length))
      .attr("height", (d) => chartHeight - sepalYScale(d.length));

    // Animate petal bars
    petalBars
      .transition()
      .duration(800)
      .delay((d, i) => i * 200 + 400)
      .attr("y", (d) => petalYScale(d.length))
      .attr("height", (d) => chartHeight - petalYScale(d.length));

    // Add value labels for sepal bars
    sepalChart
      .selectAll(".sepal-label")
      .data(sepalStats)
      .enter()
      .append("text")
      .attr("class", "sepal-label bar-label")
      .attr("x", (d) => sepalXScale(d.species) + sepalXScale.bandwidth() / 2)
      .attr("y", (d) => sepalYScale(d.length) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#333")
      .style("font-weight", "bold")
      .style("opacity", 0)
      .text((d) => d.length.toFixed(1))
      .transition()
      .duration(600)
      .delay((d, i) => i * 200 + 800)
      .style("opacity", 1);

    // Add value labels for petal bars
    petalChart
      .selectAll(".petal-label")
      .data(petalStats)
      .enter()
      .append("text")
      .attr("class", "petal-label bar-label")
      .attr("x", (d) => petalXScale(d.species) + petalXScale.bandwidth() / 2)
      .attr("y", (d) => petalYScale(d.length) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#333")
      .style("font-weight", "bold")
      .style("opacity", 0)
      .text((d) => d.length.toFixed(1))
      .transition()
      .duration(600)
      .delay((d, i) => i * 200 + 1200)
      .style("opacity", 1);

    // Add Y-axis labels
    sepalChart
      .append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -chartHeight / 2)
      .attr("y", -35)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#666")
      .text("Average Length (cm)");

    petalChart
      .append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -chartHeight / 2)
      .attr("y", -35)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#666")
      .text("Average Length (cm)");

    // Add legend (positioned between the two charts)
    const legendData = ["setosa", "versicolor", "virginica"];
    const legendItems = legend
      .selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`)
      .style("opacity", 0);

    legendItems
      .append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("rx", 2)
      .style("fill", (d) => speciesColorScale(d));

    legendItems
      .append("text")
      .attr("x", 18)
      .attr("y", 9)
      .text((d) => d.charAt(0).toUpperCase() + d.slice(1))
      .style("font-size", "14px")
      .style("fill", "#333");

    // Animate legend
    legendItems
      .transition()
      .duration(600)
      .delay((d, i) => i * 200 + 1600)
      .style("opacity", 1);

    // Clear main axis labels since we're using custom layout
    xLabel.text("");
    yLabel.text("");
  }

  function showMedianStatistics() {
    xAxis.selectAll("*").remove();
    yAxis.selectAll("*").remove();
    xGrid.selectAll("*").remove();
    yGrid.selectAll("*").remove();
    xLabel.text("");
    yLabel.text("");
    // Calculate medians by species
    const species = ["setosa", "versicolor", "virginica"];

    const sepalStats = species.map((spec) => {
      const speciesData = irisData.filter((d) => d.species === spec);
      return {
        species: spec,
        length: d3.median(speciesData, (d) => d.sepalLength),
        width: d3.median(speciesData, (d) => d.sepalWidth),
      };
    });

    const petalStats = species.map((spec) => {
      const speciesData = irisData.filter((d) => d.species === spec);
      return {
        species: spec,
        length: d3.median(speciesData, (d) => d.petalLength),
        width: d3.median(speciesData, (d) => d.petalWidth),
      };
    });

    // Create two chart areas
    const chartWidth = (width - 40) / 2; // 40px gap between charts
    const chartHeight = height - 80; // Leave space for titles

    // Create groups for each chart
    const sepalChart = g
      .append("g")
      .attr("class", "sepal-chart")
      .attr("transform", "translate(0, 40)");

    const petalChart = g
      .append("g")
      .attr("class", "petal-chart")
      .attr("transform", `translate(${chartWidth + 40}, 40)`);

    // Add chart titles
    g.append("text")
      .attr("class", "chart-title")
      .attr("x", chartWidth / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text("Median Sepal Length");

    g.append("text")
      .attr("class", "chart-title")
      .attr("x", chartWidth + 40 + chartWidth / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text("Median Petal Length");

    // Create scales for sepal chart
    const sepalXScale = d3
      .scaleBand()
      .domain(species)
      .range([0, chartWidth])
      .padding(0.3);

    const sepalYScale = d3
      .scaleLinear()
      .domain([0, d3.max(sepalStats, (d) => d.length)])
      .nice()
      .range([chartHeight, 0]);

    // Create scales for petal chart
    const petalXScale = d3
      .scaleBand()
      .domain(species)
      .range([0, chartWidth])
      .padding(0.3);

    const petalYScale = d3
      .scaleLinear()
      .domain([0, d3.max(petalStats, (d) => d.length)])
      .nice()
      .range([chartHeight, 0]);

    // Add axes for sepal chart
    sepalChart
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(
        d3
          .axisBottom(sepalXScale)
          .tickFormat((d) => d.charAt(0).toUpperCase() + d.slice(1))
      );

    sepalChart
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(sepalYScale));

    // Add axes for petal chart
    petalChart
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(
        d3
          .axisBottom(petalXScale)
          .tickFormat((d) => d.charAt(0).toUpperCase() + d.slice(1))
      );

    petalChart
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(petalYScale));

    // Use the same color scale as the scatter plots
    const speciesColorScale = d3
      .scaleOrdinal()
      .domain(["setosa", "versicolor", "virginica"])
      .range(["#e74c3c", "#2ecc71", "#3498db"]);

    // Create sepal bars
    const sepalBars = sepalChart
      .selectAll(".sepal-bar")
      .data(sepalStats)
      .enter()
      .append("rect")
      .attr("class", "sepal-bar bar")
      .attr("x", (d) => sepalXScale(d.species))
      .attr("width", sepalXScale.bandwidth())
      .attr("y", chartHeight)
      .attr("height", 0)
      .style("fill", (d) => speciesColorScale(d.species))
      .style("opacity", 0.8)
      .style("stroke", "#fff")
      .style("stroke-width", 2)
      .on("mouseover", function (event, d) {
        tooltip
          .style("display", "block")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px")
          .html(
            `<strong>${
              d.species.charAt(0).toUpperCase() + d.species.slice(1)
            }</strong><br>Median Sepal Length: ${d.length.toFixed(
              2
            )} cm<br>Median Sepal Width: ${d.width.toFixed(2)} cm`
          );
      })
      .on("mouseout", hideTooltip);

    // Create petal bars
    const petalBars = petalChart
      .selectAll(".petal-bar")
      .data(petalStats)
      .enter()
      .append("rect")
      .attr("class", "petal-bar bar")
      .attr("x", (d) => petalXScale(d.species))
      .attr("width", petalXScale.bandwidth())
      .attr("y", chartHeight)
      .attr("height", 0)
      .style("fill", (d) => speciesColorScale(d.species))
      .style("opacity", 0.8)
      .style("stroke", "#fff")
      .style("stroke-width", 2)
      .on("mouseover", function (event, d) {
        tooltip
          .style("display", "block")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px")
          .html(
            `<strong>${
              d.species.charAt(0).toUpperCase() + d.species.slice(1)
            }</strong><br>Avg Petal Length: ${d.length.toFixed(
              2
            )} cm<br>Avg Petal Width: ${d.width.toFixed(2)} cm`
          );
      })
      .on("mouseout", hideTooltip);

    // Animate sepal bars
    sepalBars
      .transition()
      .duration(800)
      .delay((d, i) => i * 200)
      .attr("y", (d) => sepalYScale(d.length))
      .attr("height", (d) => chartHeight - sepalYScale(d.length));

    // Animate petal bars
    petalBars
      .transition()
      .duration(800)
      .delay((d, i) => i * 200 + 400)
      .attr("y", (d) => petalYScale(d.length))
      .attr("height", (d) => chartHeight - petalYScale(d.length));

    // Add value labels for sepal bars
    sepalChart
      .selectAll(".sepal-label")
      .data(sepalStats)
      .enter()
      .append("text")
      .attr("class", "sepal-label bar-label")
      .attr("x", (d) => sepalXScale(d.species) + sepalXScale.bandwidth() / 2)
      .attr("y", (d) => sepalYScale(d.length) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#333")
      .style("font-weight", "bold")
      .style("opacity", 0)
      .text((d) => d.length.toFixed(1))
      .transition()
      .duration(600)
      .delay((d, i) => i * 200 + 800)
      .style("opacity", 1);

    // Add value labels for petal bars
    petalChart
      .selectAll(".petal-label")
      .data(petalStats)
      .enter()
      .append("text")
      .attr("class", "petal-label bar-label")
      .attr("x", (d) => petalXScale(d.species) + petalXScale.bandwidth() / 2)
      .attr("y", (d) => petalYScale(d.length) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#333")
      .style("font-weight", "bold")
      .style("opacity", 0)
      .text((d) => d.length.toFixed(1))
      .transition()
      .duration(600)
      .delay((d, i) => i * 200 + 1200)
      .style("opacity", 1);

    // Add Y-axis labels
    sepalChart
      .append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -chartHeight / 2)
      .attr("y", -35)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#666")
      .text("Average Length (cm)");

    petalChart
      .append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -chartHeight / 2)
      .attr("y", -35)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#666")
      .text("Average Length (cm)");

    // Add legend (positioned between the two charts)
    const legendData = ["setosa", "versicolor", "virginica"];
    const legendItems = legend
      .selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`)
      .style("opacity", 0);

    legendItems
      .append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("rx", 2)
      .style("fill", (d) => speciesColorScale(d));

    legendItems
      .append("text")
      .attr("x", 18)
      .attr("y", 9)
      .text((d) => d.charAt(0).toUpperCase() + d.slice(1))
      .style("font-size", "14px")
      .style("fill", "#333");

    // Animate legend
    legendItems
      .transition()
      .duration(600)
      .delay((d, i) => i * 200 + 1600)
      .style("opacity", 1);

    // Clear main axis labels since we're using custom layout
    xLabel.text("");
    yLabel.text("");
  }

  function showTooltip(event, d) {
    tooltip
      .style("display", "block")
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 10 + "px").html(`
                    <strong>${
                      d.species.charAt(0).toUpperCase() + d.species.slice(1)
                    }</strong><br>
                    Sepal: ${d.sepalLength} × ${d.sepalWidth} cm<br>
                    Petal: ${d.petalLength} × ${d.petalWidth} cm
                `);
  }

  function hideTooltip() {
    tooltip.style("display", "none");
  }
}
