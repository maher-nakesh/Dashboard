import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import * as d3 from 'd3';

interface BogBodyData {
  bog_body_type: string;
  total: number;
}

@Component({
  selector: 'app-wedgit-sonification',
  templateUrl: './sonification.component.html',
  styleUrls: ['./sonification.component.scss']
})
export class SonificationComponent implements AfterViewInit {

  @ViewChild('chartContainer', { static: false }) private chartContainer!: ElementRef;

  private margin = { top: 70, right: 40, bottom: 60, left: 175 };
  private width = 660 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.createChart();
  }

  private createChart(): void {
    const chartContainerElement = this.chartContainer?.nativeElement;

    if (chartContainerElement) {
      const svg = d3.select(chartContainerElement).append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

      d3.csv<BogBodyData>("assets/bog_bodies.csv", (d: any) => ({
        bog_body_type: d['bog_body_type'],
        total: +d['total']
      })).then(data => {
      data.sort((a, b) => d3.ascending(a.total, b.total));

      const x = d3.scaleLinear()
        .range([0, this.width])
        .domain([0, d3.max(data, d => d.total) as number]);

      const y = d3.scaleBand()
        .range([this.height, 0])
        .padding(0.1)
        .domain(data.map(d => d.bog_body_type));

      const xAxis = d3.axisBottom(x).ticks(5).tickSize(0);
      const yAxis = d3.axisLeft(y).tickSize(0).tickPadding(10);

      svg.selectAll("line.vertical-grid")
        .data(x.ticks(5))
        .enter()
        .append("line")
        .attr("class", "vertical-grid")
        .attr("x1", d => x(d))
        .attr("y1", 0)
        .attr("x2", d => x(d))
        .attr("y2", this.height)
        .style("stroke", "gray")
        .style("stroke-width", 0.5)
        .style("stroke-dasharray", "3 3");

      svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d.bog_body_type) as number)
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", d => x(d.total))
        .attr('fill', '#96a5b9');

      svg.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", `translate(0,${this.height})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove());

      svg.append("g")
        .attr("class", "y axis")
        .style("font-size", "8px")
        .call(yAxis)
        .selectAll('path')
        .style('stroke-width', '1.75px');

      svg.selectAll(".y.axis .tick text")
        .each(function(d) {
          d3.select(this).text((d as string).toUpperCase());
        });

      svg.selectAll(".label")
        .data(data)
        .enter().append("text")
        .attr("x", d => x(d.total) + 5)
        .attr("y", d => (y(d.bog_body_type) as number) + y.bandwidth() / 2)
        .attr("dy", ".35em")
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style('fill', '#3c3d28')
        .text(d => d.total);

      svg.append("text")
        .attr("transform", `translate(${this.width / 2},${this.height + this.margin.bottom / 2})`)
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "black")
        .style("font-family", "sans-serif")
        .attr("dy", "1em")
        .text("Total");

      svg.append("text")
        .attr("x", this.margin.left - 335)
        .attr("y", this.margin.top - 110)
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("font-family", "sans-serif")
        .text("Bog Mummies Are the Most Frequently Observed Preservation State");

      svg.append("text")
        .attr("transform", `translate(${this.margin.left - 335},${this.height + this.margin.bottom - 10})`)
        .style("text-anchor", "start")
        .style("font-size", "8px")
        .style("fill", "lightgray")
        .style("font-family", "sans-serif")
        .html("<a href='https://www.cambridge.org/core/journals/antiquity/article/bogs-bones-and-bodies-the-deposition-of-human-remains-in-northern-european-mires-9000-bcad-1900/B90A16A211894CB87906A7BCFC0B2FC7#supplementary-materials'>Source: Bogs, Bones and Bodies - Published by Cambridge Press</a>");
    });
  }
}}