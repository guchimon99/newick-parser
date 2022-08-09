const parser = require('./parser');
const { NewickNode, splitBranchNewick } = parser

test("no nodes are named brances", () => {
  expect(JSON.stringify(
    splitBranchNewick("(,,(,))")
  )).toBe(JSON.stringify(
    [
      "",
      "",
      "(,)"
    ]
  ));
})

test("no nodes are named", () => {
  expect(JSON.stringify(
    parser("(,,(,));")
  )).toBe(JSON.stringify(
    new NewickNode(
      [
        new NewickNode(),
        new NewickNode(),
        new NewickNode([
          new NewickNode(),
          new NewickNode()
        ]),
      ]
    )
  ));
});

test("leaf nodes are named", () => {
  expect(JSON.stringify(
    parser("(A,B,(C,D));")
  )).toBe(JSON.stringify(
    new NewickNode(
      [
        new NewickNode(null, "A"),
        new NewickNode(null, "B"),
        new NewickNode([
          new NewickNode(null, "C"),
          new NewickNode(null, "D")
        ]),
      ]
    )
  ));
});

test("all nodes are named", () => {
  expect(JSON.stringify(
    parser("(A,B,(C,D)E)F;")
  )).toBe(JSON.stringify(
    new NewickNode([
        new NewickNode(null, "A"),
        new NewickNode(null, "B"),
        new NewickNode([
          new NewickNode(null, "C"),
          new NewickNode(null, "D")
        ], "E"),
    ], "F")
  ));
});

test("all but root node have a distance to parent", () => {
  expect(JSON.stringify(
    parser("(:0.1,:0.2,(:0.3,:0.4):0.5);")
  )).toBe(JSON.stringify(
    new NewickNode([
        new NewickNode(null, null, 0.1),
        new NewickNode(null, null, 0.2),
        new NewickNode([
          new NewickNode(null, null, 0.3),
          new NewickNode(null, null, 0.4)
        ], null, 0.5),
    ])
  ));
});

test("all have a distance to parent", () => {
  expect(JSON.stringify(
    parser("(:0.1,:0.2,(:0.3,:0.4):0.5):0.0;")
  )).toBe(JSON.stringify(
    new NewickNode([
        new NewickNode(null, null, 0.1),
        new NewickNode(null, null, 0.2),
        new NewickNode([
          new NewickNode(null, null, 0.3),
          new NewickNode(null, null, 0.4)
        ], null, 0.5),
    ], null, 0.0)
  ));
});

test("distances and all names", () => {
  expect(JSON.stringify(
    parser("(A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5)F;")
  )).toBe(JSON.stringify(
    new NewickNode([
        new NewickNode(null, "A", 0.1),
        new NewickNode(null, "B", 0.2),
        new NewickNode([
          new NewickNode(null, "C", 0.3),
          new NewickNode(null, "D", 0.4)
        ], "E", 0.5),
    ], "F")
  ));
});

test("a tree rooted on a leaf node (rare)", () => {
  expect(JSON.stringify(
    parser("((B:0.2,(C:0.3,D:0.4)E:0.5)F:0.1)A;")
  )).toBe(JSON.stringify(
    new NewickNode([
        new NewickNode([
          new NewickNode(null, "B", 0.2),
          new NewickNode([
            new NewickNode(null, "C", 0.3),
            new NewickNode(null, "D", 0.4)
          ], "E", 0.5),
        ], "F", 0.1),
    ], "A")
  ));
});
