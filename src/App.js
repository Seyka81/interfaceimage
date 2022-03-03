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
import {Icon} from "@iconify/react";
import ImageViewer from "react-simple-image-viewer";

const axios = require('axios');

const initImages= async ()=>{  
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
  const getImages= async (data)=>{  
    const tabTest = [];
      try{ 
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
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [images, setImages] = useState([]);
  
  
  
  useEffect(()=>{
    initImages().then(resp => setList(resp));
  },[]);

  const supImg = (e)  => {
    try{ 
      const result= axios.delete('/images/'+e.currentTarget.id);
      result.then(resp => 
        getImages(resp.data).then(resp1=> setList(resp1))

      );
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
      result.then(resp => 
        getImages(resp.data).then(resp1=> setList(resp1))

      );

    }catch (err){
      console.log(err);
			return [];
    }
  }



  const openImageViewer = (e)  => {
    const targetindex=e.currentTarget.id;
    try{ 
      const result= axios.get('/imagesAfficher/'+targetindex);
      const imagesv2=["http://localhost:5000/imagesAfficher/"+targetindex]
      setImages(imagesv2);
      setIsViewerOpen(true);
    }catch (err){
      console.log(err);
			return [];
    }
  }
  const closeImageViewer=()=>{
    setIsViewerOpen(false);
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
                <TableCell id = {item.id} align="right" onClick={openImageViewer}>
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
      {isViewerOpen && (
        <ImageViewer
          src={images}
          onClose={closeImageViewer}
          disableScroll={false}
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0.9)"
          }}
          closeOnClickOutside={true}
        />
      )}
    </div>
  );
}

export default App;
