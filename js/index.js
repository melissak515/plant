var data = [
  // { "name" : "Korean", "parent":"null", "value":"null"},
  { "name" : "Berries & Fruiting Bushes", "parent":"Korean", "value":"null", "image":"#i6"},
    { "name" : "Chokeberries", "parent":"Berries & Fruiting Bushes", "value":28, "image":"#i1" },
    { "name" : "Blackberries", "parent":"Berries & Fruiting Bushes", "value":4, "image":"#i2" },
    { "name" : "Blueberries", "parent":"Berries & Fruiting Bushes", "value":28, "image":"#i3" },
    { "name" : "Bush Cherries", "parent":"Berries & Fruiting Bushes", "value":2, "image":"#i4" },
    { "name" : "Autumn Magic", "parent":"Chokeberries", "value":55, "image":"#i5" },
    { "name" : "Nero", "parent":"Chokeberries", "value":45, "image":"#i5" },
    { "name" : "Rolling River", "parent":"Chokeberries", "value":5, "image":"#i5" },
    { "name" : "Viking", "parent":"Chokeberries", "value":5, "image":"#i5" },
    { "name" : "Apache", "parent":"Blackberries", "value":30, "image":"#i2" },
    { "name" : "Black Satin", "parent":"Blackberries", "value":50, "image":"#i2" },
    { "name" : "Boysenberry", "parent":"Blackberries", "value":20, "image":"#i2" },
    { "name" : "Cherokee", "parent":"Blackberries", "value":20, "image":"#i2" },
    { "name" : "Arien", "parent":"Blueberries", "value":75, "image":"#i3" },
    { "name" : "Berkeley", "parent":"Blueberries", "value":25, "image":"#i3" },
    { "name" : "Blue Gold", "parent":"Blueberries", "value":75, "image":"#i3" },
    { "name" : "Duke", "parent":"Blueberries", "value":25, "image":"#i3" },
    { "name" : "Black Chokeberry", "parent":"Bush Cherries", "value":25, "image":"#i4" },
    { "name" : "Jan", "parent":"Bush Cherries", "value":6, "image":"#i4"},
    { "name" : "Korean Bush Cherry", "parent":"Bush Cherries", "value":18, "image":"#i4" },
    { "name" : "Sand Cherry", "parent":"Bush Cherries", "value":46, "image":"#i4" },
  ];

// var data2 = [
//   { "name" : "Japanese", "parent":"null", "value":"null"},
//     { "name" : "Berries & Fruiting Bushes", "parent":"Japanese", "value":"null", "image":"#i1"},
//       { "name" : "Chokeberries", "parent":"Berries & Fruiting Bushes", "value":28, "image":"#i1" },
//       { "name" : "Blackberries", "parent":"Berries & Fruiting Bushes", "value":4, "image":"#i2" },
//       { "name" : "Blueberries", "parent":"Berries & Fruiting Bushes", "value":28, "image":"#i3" },
//       { "name" : "Bush Cherries", "parent":"Berries & Fruiting Bushes", "value":2, "image":"#i4" },
//       ];



var dataMap = data.reduce(function(map, node) {
 map[node.name] = node;
 return map;
}, {});

var treeData = [];
data.forEach(function(node) {
 // add to parent
 var parent = dataMap[node.parent];
 if (parent) {
  // create child array if it doesn't exist
  (parent.children || (parent.children = []))
   // add node to child array
   .push(node);
 } else {
  // parent is null or missing
  treeData.push(node);
 }
});

// added second map: data2
// var data2Map = data2.reduce(function(map,node) {
//   map[node.name] = node;
//   return map;
// }, {});

// ************** Generate the tree diagram *****************
var margin = {top: 20, right: 120, bottom: 20, left: 120},
width = 850 - margin.right - margin.left,
height = 800 - margin.top - margin.bottom;
var i = 0,
duration = 500,
root;

var tree = d3.layout.tree()
.size([height, width]);

var diagonal = d3.svg.diagonal()
.projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
.attr("width", width + margin.right + margin.left)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData[0];
root.x0 = height / 2;
root.y0 = 0;
update(root);

var pieSvg = d3.select("body").append("svg")
.attr("width", 250 + margin.right + margin.left)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.select(self.frameElement).style("height", "500px");

function update(source) {

// Compute the new tree layout.
var nodes = tree.nodes(root).reverse(),
links = tree.links(nodes);

// Normalize for fixed-depth.
nodes.forEach(function(d) { d.y = d.depth * 180; });
//nodes.forEach(console.log("Node"));
// Update the nodes…
var node = svg.selectAll("g.node")
.data(nodes, function(d) { return d.id || (d.id = ++i); });

// Enter any new nodes at the parent's previous position.
var nodeEnter = node.enter().append("g")
.attr("class", "node")
.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
.on("click", click);

nodeEnter.append("circle")
.attr("r", 1e-6)
.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
.on("mouseover", function(d){updatepie(d);})
.on("mouseout", function(d){clearpie(d);})
;

nodeEnter.append("text")
.attr("x", function(d) { return d.children  ? 0 : 13; })
.attr("y", function(d) { return d.children  ? -13 : 0; })
.attr("dy", ".35em")
.attr("text-anchor", function(d) { return d.children  ? "middle" : "start"; })
.text(function(d) { return d.name; })
.style("fill-opacity", 1e-6)
.on("mouseover", function(d){updatepie(d);})
.on("mouseout", function(d){clearpie(d);})
;
// Transition nodes to their new position.
var nodeUpdate = node.transition()
.duration(duration)
.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

nodeUpdate.select("circle")
.attr("r", 5)
.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

nodeUpdate.select("text")
.style("fill-opacity", 1)
.attr("x", function(d) { return  d.children ? 0 : 13; })
.attr("y", function(d) { return d.children  ? -13 : 0; })
.attr("dy", ".35em")
.attr("text-anchor", function(d) { return  d.children ? "middle" : "start"; });

// Transition exiting nodes to the parent's new position.
var nodeExit = node.exit().transition()
.duration(duration)
.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
.remove();

nodeExit.select("circle")
.attr("r", 1e-6);

nodeExit.select("text")
.style("fill-opacity", 1e-6);

// Update the links…
var link = svg.selectAll("path.link")
.data(links, function(d) { return d.target.id; });

// Enter any new links at the parent's previous position.
link.enter().insert("path", "g")
.attr("class", "link")
//.attr("stroke-width",function(d){return d.target.value/100*7+"px";})
.attr("d", function(d) {
var o = {x: source.x0, y: source.y0};
return diagonal({source: o, target: o});
});

// Transition links to their new position.
link.transition()
.duration(duration)
.attr("d", diagonal);

// Transition exiting nodes to the parent's new position.
link.exit().transition()
.duration(duration)
.attr("d", function(d) {
var o = {x: source.x, y: source.y};
return diagonal({source: o, target: o});
})
.remove();

// Stash the old positions for transition.
nodes.forEach(function(d) {
d.x0 = d.x;
d.y0 = d.y;
});
}

  function updatepie(d){
   console.log(d);
   console.log(d.image);
   $(d.image).show();
   console.log(d.tag);
   $(d.tag).show();
  ;};


  function clearpie(d){
    console.log(d);
    console.log(d.image);
    $(d.image).hide();
    console.log(d.tag);
    $(d.tag).hide();
   ;};



// Toggle children on click.
function click(d) {
if (d.children) {
d._children = d.children;
d.children = null;
} else {
d.children = d._children;
d._children = null;
}


update(d);


}
