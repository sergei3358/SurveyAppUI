import path from 'path';


const filePath = path.join(process.cwd(), 'data', 'questionSets.json');

const appendDataToJson = async (newData: any) => {
  
    //try {
      //const existingData = await readFile(filePath, 'utf-8');
      //const jsonData = JSON.parse(existingData);
      //jsonData.push(newData);
      //await writeFile(filePath, JSON.stringify(jsonData, null, 2));
      //console.log("Data successfully appended to the end of the file.");
    //} catch (error) {
      //console.error("An error occurred while appending data to the file:", error);
    //}
  };

  export { appendDataToJson };