
/*
## MyToDoReact version 1.0.
##
## Copyright (c) 2021 Oracle, Inc.
## Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
/*
 * This is the application main React component. We're using "function"
 * components in this application. No "class" components should be used for
 * consistency.
 * @author  jean.de.lavarene@oracle.com
 */
import React, { useState, useEffect } from 'react';
import NewItem from './NewItem';
import API_LIST from './API';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import DoneIcon from '@mui/icons-material/Done';
import UndoIcon from '@mui/icons-material/Undo';
import { Button, TableBody, CircularProgress, Paper, Container, Typography, Box, Fade } from '@mui/material';
import Moment from 'react-moment';

/* In this application we're using Function Components with the State Hooks
 * to manage the states. See the doc: https://reactjs.org/docs/hooks-state.html
 * This App component represents the entire app. It renders a NewItem component
 * and two tables: one that lists the todo items that are to be done and another
 * one with the items that are already done.
 */
function App() {
    // isLoading is true while waiting for the backend to return the list
    // of items. We use this state to display a spinning circle:
    const [isLoading, setLoading] = useState(false);
    // Similar to isLoading, isInserting is true while waiting for the backend
    // to insert a new item:
    const [isInserting, setInserting] = useState(false);
    // The list of todo items is stored in this state. It includes the "done"
    // "not-done" items:
    const [items, setItems] = useState([]);
    // In case of an error during the API call:
    const [error, setError] = useState();
    // Para gestionar los elementos destacados (solo front-end)
    const [starredItems, setStarredItems] = useState({});

    function deleteItem(deleteId) {
      // console.log("deleteItem("+deleteId+")")
      fetch(API_LIST+"/"+deleteId, {
        method: 'DELETE',
      })
      .then(response => {
        // console.log("response=");
        // console.log(response);
        if (response.ok) {
          // console.log("deleteItem FETCH call is ok");
          return response;
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(
        (result) => {
          const remainingItems = items.filter(item => item.id !== deleteId);
          setItems(remainingItems);
          // Eliminar también de los destacados
          const newStarredItems = {...starredItems};
          delete newStarredItems[deleteId];
          setStarredItems(newStarredItems);
        },
        (error) => {
          setError(error);
        }
      );
    }

    function toggleDone(event, id, description, done) {
      event.preventDefault();
      modifyItem(id, description, done).then(
        (result) => { reloadOneIteam(id); },
        (error) => { setError(error); }
      );
    }

    function reloadOneIteam(id){
      fetch(API_LIST+"/"+id)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong ...');
          }
        })
        .then(
          (result) => {
            const items2 = items.map(
              x => (x.id === id ? {
                 ...x,
                 'description':result.description,
                 'done': result.done
                } : x));
            setItems(items2);
          },
          (error) => {
            setError(error);
          });
    }

    function modifyItem(id, description, done) {
      // console.log("deleteItem("+deleteId+")")
      var data = {"description": description, "done": done};
      return fetch(API_LIST+"/"+id, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(response => {
        // console.log("response=");
        // console.log(response);
        if (response.ok) {
          // console.log("deleteItem FETCH call is ok");
          return response;
        } else {
          throw new Error('Something went wrong ...');
        }
      });
    }

    // Nueva función para destacar elementos (solo frontend)
    function toggleStarItem(id) {
      setStarredItems(prevStarred => {
        const newStarred = {...prevStarred};
        if (newStarred[id]) {
          delete newStarred[id];
        } else {
          newStarred[id] = true;
        }
        return newStarred;
      });
    }

    /*
    To simulate slow network, call sleep before making API calls.
    const sleep = (milliseconds) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    */
    useEffect(() => {
      setLoading(true);
      // sleep(5000).then(() => {
      fetch(API_LIST)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong ...');
          }
        })
        .then(
          (result) => {
            setLoading(false);
            setItems(result);
          },
          (error) => {
            setLoading(false);
            setError(error);
          });

      //})
    },
    // https://en.reactjs.org/docs/faq-ajax.html
    [] // empty deps array [] means
       // this useEffect will run once
       // similar to componentDidMount()
    );

    function addItem(text){
      console.log("addItem("+text+")")
      setInserting(true);
      var data = {};
      data.description = text;
      fetch(API_LIST, {
        method: 'POST',
        // We convert the React state to JSON and send it as the POST body
        body: JSON.stringify(data)
      }).then((response) => {
        // This API doens't return a JSON document
        // console.log(response);
        // console.log();
        // console.log(response.headers.location);
        // return response.json();
        if (response.ok) {
          return response;
        } else {
          throw new Error('Something went wrong ...');
        }
      }).then(
        (result) => {
          var id = result.headers.get('location');
          var newItem = {"id": id, "description": text}
          setItems([newItem, ...items]);
          setInserting(false);
        },
        (error) => {
          setInserting(false);
          setError(error);
        }
      );
    }

    const getItemStyle = (isStarred) => {
      return {
        backgroundColor: isStarred ? 'rgba(255, 215, 0, 0.15)' : 'white',
        boxShadow: isStarred ? '0 0 5px rgba(255, 215, 0, 0.5)' : 'none',
        transition: 'all 0.3s ease',
        borderRadius: '8px',
        marginBottom: '8px',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeft: isStarred ? '4px solid gold' : 'none'
      };
    };

    return (
      <Container maxWidth="md" sx={{ pt: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 'bold', 
            color: '#2c3e50',
            mb: 1
          }}>
            MY TODO LIST
          </Typography>
          <Box sx={{ width: '80px', height: '4px', backgroundColor: '#3498db', margin: '0 auto', mb: 3 }} />
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <NewItem addItem={addItem} isInserting={isInserting}/>
        </Box>

        { error &&
          <Paper sx={{ p: 2, mb: 3, bgcolor: '#ffebee' }}>
            <Typography color="error">Error: {error.message}</Typography>
          </Paper>
        }
        
        { isLoading &&
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        }
        
        { !isLoading &&
        <Box id="maincontent">
          <Typography variant="h5" component="h2" sx={{ 
            mb: 2, 
            fontWeight: 'bold',
            color: '#2c3e50',
            borderBottom: '2px solid #3498db',
            paddingBottom: '8px'
          }}>
            Tasks To Do
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            {items.filter(item => !item.done).length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                <Typography color="textSecondary">No pending tasks. Add something new!</Typography>
              </Paper>
            ) : (
              items.map(item => !item.done && (
                <Fade in={true} key={item.id} timeout={500}>
                  <Paper sx={getItemStyle(starredItems[item.id])}>
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                      <Typography sx={{ fontWeight: 500, mb: 0.5 }}>{item.description}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        <Moment format="MMM Do HH:mm">{item.createdAt}</Moment>
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant={starredItems[item.id] ? "contained" : "outlined"} 
                        onClick={() => toggleStarItem(item.id)} 
                        startIcon={<StarIcon />}
                        color={starredItems[item.id] ? "warning" : "inherit"}
                        size="small"
                        sx={{ minWidth: '90px' }}
                      >
                        {starredItems[item.id] ? "Unstar" : "Star"}
                      </Button>
                      <Button 
                        variant="contained" 
                        onClick={(event) => toggleDone(event, item.id, item.description, !item.done)} 
                        startIcon={<DoneIcon />}
                        color="success"
                        size="small"
                      >
                        Done
                      </Button>
                    </Box>
                  </Paper>
                </Fade>
              ))
            )}
          </Box>
          
          <Typography variant="h5" component="h2" sx={{ 
            mb: 2, 
            mt: 5, 
            fontWeight: 'bold',
            color: '#2c3e50',
            borderBottom: '2px solid #3498db',
            paddingBottom: '8px'
          }}>
            Completed Tasks
          </Typography>
          
          <Box>
            {items.filter(item => item.done).length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                <Typography color="textSecondary">No completed tasks yet.</Typography>
              </Paper>
            ) : (
              items.map(item => item.done && (
                <Fade in={true} key={item.id} timeout={500}>
                  <Paper sx={{
                    ...getItemStyle(starredItems[item.id]),
                    backgroundColor: starredItems[item.id] ? 'rgba(255, 215, 0, 0.15)' : 'rgba(236, 240, 241, 0.7)',
                    opacity: 0.85
                  }}>
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                      <Typography sx={{ 
                        fontWeight: 400, 
                        mb: 0.5, 
                        textDecoration: 'line-through',
                        color: 'text.secondary'
                      }}>
                        {item.description}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        <Moment format="MMM Do HH:mm">{item.createdAt}</Moment>
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant={starredItems[item.id] ? "contained" : "outlined"} 
                        onClick={() => toggleStarItem(item.id)} 
                        startIcon={<StarIcon />}
                        color={starredItems[item.id] ? "warning" : "inherit"}
                        size="small"
                      >
                        {starredItems[item.id] ? "Unstar" : "Star"}
                      </Button>
                      <Button 
                        variant="outlined" 
                        onClick={(event) => toggleDone(event, item.id, item.description, !item.done)} 
                        startIcon={<UndoIcon />}
                        color="primary"
                        size="small"
                      >
                        Undo
                      </Button>
                      <Button 
                        startIcon={<DeleteIcon />} 
                        variant="outlined" 
                        onClick={() => deleteItem(item.id)} 
                        color="error"
                        size="small"
                      >
                        Delete
                      </Button>
                    </Box>
                  </Paper>
                </Fade>
              ))
            )}
          </Box>
        </Box>
        }
        
        <Box sx={{ textAlign: 'center', mt: 6, mb: 2, pt: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="body2" color="textSecondary">
            MyToDoReact © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    );
}
export default App;
