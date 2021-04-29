export function separateTable(tables, mainTableId) {
  return tables.map((table) =>
    table.parent?.id === mainTableId ? { ...table, parent: undefined } : table
  );
}
