import './App.css';
import React from "react";
import { useEffect, useState } from "react";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import { Icon } from "@iconify/react";
import ImageViewer from "react-simple-image-viewer";


const axios = require('axios');

const initImages = async (clientEncours) => {
  const tabTest = [];
  
    console.log(clientEncours);
    try {
      const result = await axios.get('/images/'+clientEncours);
      let data = result.data;
      console.log("data:", data);
      Object.keys(data).forEach(element => {
  
        tabTest.push(
          {
            id: element,
            url: data[element]
          });
      });
      console.log("nouvTabl:", tabTest);
      return tabTest;
    } catch (err) {
      console.log(err);
      return [];
    }

  
}
const getImages = async (data) => {
  const tabTest = [];
  try {
    console.log("data:", data);
    Object.keys(data).forEach(element => {

      tabTest.push(
        {
          id: element,
          url: data[element]
        });
    });
    console.log("nouvTabl:", tabTest);
    return tabTest;
  } catch (err) {
    console.log(err);
    return [];
  }
}
function App() {

  const [list, setList] = useState([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [images, setImages] = useState([]);
  const pseudo = [{pseudoNom:"Toto",present:true },{pseudoNom:"Tata",present:true },{pseudoNom:"Tutu",present:false },{pseudoNom:"Titi",present:true },{pseudoNom:"Tete",present:true }];

  
  const [clientEncours, setClient] = useState("Clients");

  // useEffect(() => {
  //   initImages(clientEncours).then(resp => 
  //     setList(resp)
  //     );
  // }, []);


  const supImg = (e) => {
    try {
      const result = axios.delete('/images/' + e.currentTarget.id);
      result.then(resp =>
        getImages(resp.data).then(resp1 => setList(resp1))

      );
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  const uploadImage = (e) => {
    const data = new FormData();
    const files = e.target.files;
    data.append('file', files[0]);
    data.append('filename', files[0].name)
    try {
      const result = axios.post('/imagesUpload/' + files[0].name, data);
      result.then(resp =>
        getImages(resp.data).then(resp1 => setList(resp1))

      );

    } catch (err) {
      console.log(err);
      return [];
    }
  }



  const openImageViewer = (e) => {
    const targetindex = e.currentTarget.id;
    try {
      const result = axios.get('/imagesAfficher/' + targetindex);
      const imagesv2 = ["http://localhost:5000/imagesAfficher/" + targetindex]
      setImages(imagesv2);
      setIsViewerOpen(true);
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  const closeImageViewer = () => {
    setIsViewerOpen(false);
  }
  const clientTraitement=(e)=>{
    console.log(typeof e.currentTarget.id);
    setClient(e.currentTarget.id);
    const clientAtraiter=e.currentTarget.id;
    initImages(clientAtraiter).then(resp => 
      setList(resp)
      );
  }
  return (


    <div style={{ backgroundColor: "#f6f6f6", height: "100vh" }}>

      <div style={{ float: "left", backgroundColor: "#4f4f4f", height: "100vh", width: "280px", borderRight: "solid"}}>
        <h1 style={{ textAlign: "center" , color: "white" }}>Clients</h1>

        {pseudo.map((item) => item.present ? (
          
          <p id={item.pseudoNom} key={item.pseudoNom} onClick= {clientTraitement} style={{ color:"white" ,fontWeight: "bold", paddingLeft: 10 }}>{item.pseudoNom}</p>
        
        ):<p id={item.pseudoNom} key={item.pseudoNom} onClick= {clientTraitement} style={{ color:"red" ,fontWeight: "bold", paddingLeft: 10 }}>{item.pseudoNom}</p>
        
        
        
        
        )}

      </div>
      <div style={{ paddingTop: 30, float: "left", paddingLeft: 10 }}>
        <div style={{ width: "auto" }}>
          <img src="http://www.eanqa.fr/wp-content/uploads/2022/02/logo-degrade-eanqa-horizontal.png" width="200" height="60" ></img>
          <p style={{ textAlign: "center", fontWeight: "bold", fontSize: 30 }}>{clientEncours}</p>
        </div>

        <TableContainer component={Paper}>

          <Table
            style={{
              width: 600,
            }}
            size="small"
          >
            <TableHead >

              <TableRow>
                <TableCell >Index</TableCell>
                <TableCell align="right">
                  Url Image
                </TableCell>
                <TableCell align="right">
                  Delete
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((item) => (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    {item.id}
                  </TableCell>
                  <TableCell id={item.id} align="right" onClick={openImageViewer}>
                    {item.url}
                  </TableCell>
                  <TableCell align="right">
                    <Icon id={item.id} icon="mdi:trash-can" color="blue"
                      onClick={supImg}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <input style={{ padding: 10 }}
          type="file"
          name="file"
          onChange={uploadImage}
          accept="image/*"
        />
      </div>


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
