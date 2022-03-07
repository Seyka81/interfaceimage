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
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const axios = require('axios');

const refaireImages = async (clientEncours) => {
  const tabTest = [];


  try {
    const result = await axios.get('/images/' + clientEncours);
    let data = result.data;

    Object.keys(data).forEach(element => {

      tabTest.push(
        {
          id: element,
          url: data[element]
        });
    });

    return tabTest;
  } catch (err) {
    console.log(err);
    return [];
  }


}
const initImages = async () => {
  const tabTest = [];

  try {
    const result = await axios.get('/images');
    let data = result.data;

    Object.keys(data).forEach(element => {

      tabTest.push(
        {
          id: element,
          url: data[element]
        });
    });

    return tabTest;
  } catch (err) {
    console.log(err);
    return [];
  }


}
const getImages = async (data) => {
  const tabTest = [];
  try {

    Object.keys(data).forEach(element => {

      tabTest.push(
        {
          id: element,
          url: data[element]
        });
    });
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
  const pseudo = [{ pseudoNom: "Toto", present: true }, { pseudoNom: "Tata", present: true }, { pseudoNom: "Tutu", present: false }, { pseudoNom: "Titi", present: true }, { pseudoNom: "Tete", present: true }];


  const [clientEncours, setClient] = useState("Clients");
  var clientAtraiter = "";
  useEffect(() => {
    initImages().then(resp =>
      setList(resp)
    );
  }, []);

  const retourMenu = () => {
    setClient("Clients");
    initImages().then(resp =>
      setList(resp)
    );

  }
  const supImg = (e) => {

    try {
      const result = axios.delete('/ImageListApi/' + clientEncours + '/' + e.currentTarget.id);
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
      const result = axios.post('/ImageListApi/' + clientEncours + '/' + files[0].name, data);
      result.then(resp =>
        getImages(resp.data).then(resp1 => setList(resp1))

      );

    } catch (err) {
      console.log(err);
      return [];
    }
  }



  const openImageViewer = (e) => {
    try {
      const result = axios.get('/ImageListApi/' + clientEncours + '/' + e.currentTarget.id);
      const imagesv2 = ["http://localhost:5000/ImageListApi/" + clientEncours + '/' + e.currentTarget.id]
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
  const clientTraitement = (e) => {
    console.log(e.currentTarget.id);
    setClient(e.currentTarget.id);
    clientAtraiter = e.currentTarget.id;
    refaireImages(clientAtraiter).then(resp =>
      setList(resp)
    );
  }
  const drawerWidth = 240;
  return (
    <div>
      <div>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
          >
            <Toolbar>
              <Typography variant="h6" noWrap component="div" style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}>
                <img src="http://www.eanqa.fr/wp-content/uploads/2022/02/logo-degrade-eanqa-horizontal.png" alt="eanqa" width="200" height="60" ></img>
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{
              width: drawerWidth,

              flexShrink: 0,
              '& .MuiDrawer-paper': {
                backgroundColor: "#4f4f4f",
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
            variant="permanent"
            anchor="left"
          >
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
            <h1 style={{ textAlign: "center", color: "white" }} onClick={retourMenu}>Clients ({pseudo.length})</h1>

            {pseudo.map((item) => item.present ? (

              <p id={item.pseudoNom} key={item.pseudoNom} onClick={clientTraitement} style={{ color: "white", fontWeight: "bold", paddingLeft: 10 }}>{item.pseudoNom}</p>

            ) : <p id={item.pseudoNom} key={item.pseudoNom} onClick={clientTraitement} style={{ color: "red", fontWeight: "bold", paddingLeft: 10 }}>{item.pseudoNom}</p>
            )}


          </Drawer>
          <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>

            <Toolbar />
            <p style={{ textAlign: "center", fontWeight: "bold", fontSize: 30 }}>{clientEncours}</p>


            <TableContainer component={Paper}>

              <Table
                style={{
                  width: 600,
                }}
                size="small"
              >

                <TableHead >

                  <TableRow>
                    {clientEncours !== "Clients" ? <TableCell >Index</TableCell> :
                      <TableCell >Nom du Client </TableCell>}
                    {clientEncours !== "Clients" ? <TableCell align="right">
                      Url Image
                    </TableCell> :
                      <TableCell align="right">
                        Nombre Images
                      </TableCell>}
                    {clientEncours !== "Clients" && <TableCell align="right">
                      Delete
                    </TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list.map((item) => (
                    <TableComponent
                    key={item.id}
                    id={item.id}
                    imgUrl={item.url}
                    clientenCours={clientEncours}
                    fonction={openImageViewer}
                    fonction2={supImg}
                  />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {clientEncours !== "Clients" && (
              <input style={{ padding: 10 }}
                type="file"
                name="file"
                onChange={uploadImage}
                accept="image/*"
              />
            )}
          </Box>

        </Box>
      </div>

    </div>
  );
}
class TableComponent extends React.Component {
  
  render() {
    return (
        
          <TableRow key={this.props.id}>
          <TableCell component="th" scope="row">
            {this.props.id}
          </TableCell>

          {this.props.clientenCours !== "Clients" ? <TableCell id={this.props.id} align="right" onClick={this.props.fonction}>
            {this.props.imgUrl}
          </TableCell> : <TableCell id={this.props.id} align="right">
            {this.props.imgUrl}
          </TableCell>}
          {this.props.clientenCours !== "Clients" &&
            <TableCell align="right">
              <Icon id={this.props.id} icon="mdi:trash-can" color="blue"
              onClick={this.props.fonction2}
              />
            </TableCell>}
        </TableRow>
    );
  }
}

export default App;
