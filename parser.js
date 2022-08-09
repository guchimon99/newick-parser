
/**
 *
 * @param {Newick[] | null} branchSet
 * @param {string | null} name
 * @param {number | null} length
 */
function NewickNode (branchSet = null, name = null, length = null) {
  this.name = name
  this.length = length
  this.branchSet = branchSet
}

/**
 *
 * @param {string} branchesNewick
 * @returns {string[]}
 */
function splitBranchNewick (branchesNewick) {
  const characters = Array.from(branchesNewick.replace(/^\(|\)$/g, ''))
  const result = []

  let deps = 0
  let stack = ''
  for (let i in characters) {
    const c = characters[i]

    deps += c === "(" ? 1 : c === ")" ? -1 : 0
    stack += (c === "," && deps < 1) ? "" : c

    if ((c === "," && deps < 1)) {
      result.push(stack)
      stack = ""
      continue
    }
  }
  result.push(stack)

  return result
}

/**
 *
 * @param {string} newick newick format string
 * @returns {NewickNode[]}
 */
function parse(newick) {
  const match = newick.match(/^(\(.*\))?(\w*)?(:([0-9]*[\.[0-9]*)]?)?;?$/)
  if (!match) return new NewickNode()

  const [
    ,
    branchesNewick,
    name,
    ,
    length
  ] = match

  return new NewickNode(
    branchesNewick ? splitBranchNewick(branchesNewick).map(newick => parse(newick)) : null,
    name,
    +length,
  );
}

module.exports = parse;
module.exports.NewickNode = NewickNode;
module.exports.splitBranchNewick = splitBranchNewick;
