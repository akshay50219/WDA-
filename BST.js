 class Node {
      constructor(data, x = 0, y = 0) {
        this.data = data;
        this.left = null;
        this.right = null;
        this.x = x;
        this.y = y;
      }
    }

    class BST {
      constructor() {
        this.root = null;
        this.spacingX = 60;
        this.spacingY = 70;
      }

      insert(data) {
        const newNode = new Node(data);
        if (!this.root) {
          newNode.x = 450;
          newNode.y = 40;
          this.root = newNode;
        } else {
          this._insertNode(this.root, newNode, 450, 40, 200);
        }
      }

      _insertNode(current, newNode, x, y, offset) {
        if (newNode.data.temperature < current.data.temperature) {
          if (!current.left) {
            newNode.x = x - offset;
            newNode.y = y + this.spacingY;
            current.left = newNode;
          } else {
            this._insertNode(current.left, newNode, x - offset, y + this.spacingY, offset / 1.5);
          }
        } else {
          if (!current.right) {
            newNode.x = x + offset;
            newNode.y = y + this.spacingY;
            current.right = newNode;
          } else {
            this._insertNode(current.right, newNode, x + offset, y + this.spacingY, offset / 1.5);
          }
        }
      }

      traverseAndDraw(svg, node, tooltip) {
        if (!node) return;

        if (node.left) {
          this._drawLine(svg, node.x, node.y, node.left.x, node.left.y);
          this.traverseAndDraw(svg, node.left, tooltip);
        }
        if (node.right) {
          this._drawLine(svg, node.x, node.y, node.right.x, node.right.y);
          this.traverseAndDraw(svg, node.right, tooltip);
        }

        this._drawNode(svg, node, tooltip);
      }

      _drawNode(svg, node, tooltip) {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "node");

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", node.x);
        circle.setAttribute("cy", node.y);
        circle.setAttribute("r", 20);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", node.x);
        text.setAttribute("y", node.y + 4);
        text.textContent = node.data.temperature + "°C";

        g.appendChild(circle);
        g.appendChild(text);

        // Tooltip handlers
        g.addEventListener("mouseover", () => {
          tooltip.style.opacity = 1;
          tooltip.innerHTML = `
            <strong>Location:</strong> ${node.data.location}<br/>
            <strong>Date:</strong> ${node.data.date}<br/>
            <strong>Time:</strong> ${node.data.time}<br/>
            <strong>Temp:</strong> ${node.data.temperature}°C
          `;
        });

        g.addEventListener("mousemove", (e) => {
          tooltip.style.left = e.pageX + 10 + "px";
          tooltip.style.top = e.pageY + 10 + "px";
        });

        g.addEventListener("mouseout", () => {
          tooltip.style.opacity = 0;
        });

        svg.appendChild(g);
      }

      _drawLine(svg, x1, y1, x2, y2) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("class", "link");
        svg.appendChild(line);
      }
    }

    const bst = new BST();
    const form = document.getElementById("weatherForm");
    const svg = document.getElementById("treeDisplay");
    const tooltip = document.getElementById("tooltip");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const date = document.getElementById("date").value;
      const time = document.getElementById("time").value;
      const location = document.getElementById("location").value;
      const temperature = parseFloat(document.getElementById("temperature").value);

      bst.insert({ date, time, location, temperature });

      svg.innerHTML = '';
      bst.traverseAndDraw(svg, bst.root, tooltip);

      form.reset();
    });

    function searchTemperature() {
  const value = parseFloat(document.getElementById("searchTemp").value);
  const result = searchInBST(bst.root, value);
  const output = document.getElementById("searchResult");

  if (result) {
    output.innerHTML = `
      <strong>Found:</strong><br>
      Location: ${result.data.location}<br>
      Date: ${result.data.date}<br>
      Time: ${result.data.time}<br>
      Temperature: ${result.data.temperature}°C
    `;
  } else {
    output.textContent = "No record found for that temperature.";
  }
}

function searchInBST(node, temp) {
  if (!node) return null;
  if (temp === node.data.temperature) return node;
  if (temp < node.data.temperature) return searchInBST(node.left, temp);
  return searchInBST(node.right, temp);
}