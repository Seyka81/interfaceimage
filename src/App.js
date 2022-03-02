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
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import {Icon} from "@iconify/react";


const axios = require('axios');

const getImages= async ()=>{  
  const tabTest = [];
    try{ 
      const result= await axios.get('/images');
      let data = result.data;
      console.log("data:",data);
      Object.keys(data).forEach(element => {
        
          tabTest.push(
          {
            id: element,
            url: data[element]
          });
      });
			console.log("nouvTabl:",tabTest);
			return tabTest;
    }catch (err){
      console.log(err);
			return [];
    }
  }




function App() {
  
  const [list, setList] = useState([]);
  
  useEffect(()=>{
				getImages().then(resp => setList(resp));
  },[]);

  const supImg = (e)  => {
    try{ 
      const result= axios.delete('/images/'+e.currentTarget.id);
      getImages().then(resp => setList(resp));
    }catch (err){
      console.log(err);
			return [];
    }
  }

  const uploadImage= (e)=>{ 
    const data = new FormData(); 
    const files = e.target.files;
    data.append('file', files[0]);
    data.append('filename', files[0].name)
    try{ 
      const result= axios.post('/imagesUpload/'+files[0].name,data);
      getImages().then(resp => setList(resp));
    }catch (err){
      console.log(err);
			return [];
    }
    
  }
  
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
                <TableCell align="right">
                    <Icon id = {item.id} icon="mdi:trash-can" color="blue"
                     onClick = {supImg}
                    />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <input
        type="file"
        name="file"
        onChange={uploadImage}
        accept="image/*"
        
      />
    </div>
  );
}

export default App;
