import './App.css';
import React from "react";
import {useEffect,useState} from "react";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";

const axios = require('axios');

// const res = async(url) =>
//   {
//     return await axios.get(url).then(res => res.data);
//   }



function App() {
  
  const [list, setList] = useState([]);
  const tabTest = [];
  const getImages= async ()=>{  
    try{ 
      const result= await axios.get('/images');
      let data = result.data;
      Object.keys(data).forEach(element => {
        console.log(data[element]);
        
          tabTest.push(
          {
            id: element,
            url: data[element]
          });
      });
      setList(tabTest);
    }catch (err){
      console.log(err);
    }
  }

  useEffect(()=>{
    getImages();

  },[list]);
//   function remplirTabl(tabl){
//     console.log(tabl);
    
//     Object.keys(tabl).forEach(element => {
//       console.log(tabl[element]);
      
//         tabTest.push(
//         {
//           id: element,
//           url: tabl[element]
//         });
//       });
      
//   };


// useEffect(() => {setList(tabTest);},[list]);

      

  
//   let resp = res("/images").then(reponse => {return remplirTabl(reponse)})
//                            .catch(error => console.log(error));


  
    
//   console.log(list);
  
  
  return (
    <div style={{ display: "block", padding: 30 }}>
      <TableContainer component={Paper}>
        <Table
          style={{
            width: 600,
          }}
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell>Index</TableCell>
              <TableCell align="right">
                  Url Image
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item) => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="row">
                  {item.id}
                </TableCell>
                <TableCell align="right">
                    {item.url}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
