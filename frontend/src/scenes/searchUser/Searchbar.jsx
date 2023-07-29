import React,{useState, useRef, useEffect} from 'react';
import {
  List,
  InputBase,
  useTheme,
  ListItem, 
} from '@mui/material';
import UserProfile from './UserProfile';
import { useNavigate, useLocation } from 'react-router-dom';
 
const SearchBar = ({triggerIcon}) => {
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  
  const [query, setQuery] = useState('');
  const [theUsers, setTheUsers] =  useState([]);
  const [isBlur, setIsBlur]= useState(false);
  const [isHovering, setIsHovering] = useState(false);


  useEffect(() => {
    fetch('http://localhost:3001/users/fetchall')
    .then((res)=> res.json())
    .then((data) => {
      setTheUsers(data.allUsers);
    });
  },[])

  const navigate = useNavigate(); // Initialize the navigate function
  const location = useLocation(); // pathname

  const handleNameClick = (value) => {
    console.log('The ObjectID is: ', value)
    console.log('Clickable')
     window.location.reload();
    // navigate(`/profile/${value}`);
  }
 // Clear the Inputbase Field
  const handleInputBlur = () => {
    if (!isHovering) {
      setIsBlur(false);
      setQuery(""); 
    }
  };
  //Hovering inside the ListofNames
  const handleInputHover = () => {
    setIsHovering(true)
    // console.log(isHovering ?  ' hover: true': 'hover: false')
  }
  // Hovering outside of ListofNames
  const handleMouseLeave =()=>{ 
    setIsHovering(false) 
  }
  const handleInputClick =()=> {
     setIsBlur(true) 
  }
  const inputRef = useRef(null)
  const handleIconClick = () => {
    if(inputRef.current){
      inputRef.current.click();
    } 
  }
  //props from Navbar
  useEffect(() => {
    // if true.. 
    if (triggerIcon) {
      handleIconClick();
    }
  }, [triggerIcon]);

return (
  <>
     {/* INPUT FIELD*/}
    <InputBase
      placeholder="Search..." 
      value={query}
      onChange ={(e)=> setQuery(e.target.value.toLowerCase())}
      onBlur={handleInputBlur}
      onClick={handleInputClick}
      ref={inputRef}
      sx={{
          width: '17rem',
          borderRadius: '50rem',
          padding: '.4rem 3rem',
          position: 'relative',
          background: neutralLight,
        }}
    />
      
    {/* if isBlur or Cursor-focus-on-Input-Field 'show ListofNames' : 'null' */}
    {isBlur ? (
      <div 
        style={{
          position: 'absolute',
          width: '270px',
          borderRadius: '50%',
          backgroundColor: 'blue',
        }}
        onMouseLeave={handleMouseLeave} 
        onMouseOver={handleInputHover}
      >
        <List 
          style={{
            background: neutralLight,
            borderRadius: '0.75rem',
            zIndex: 2,
            }}
        >
          {/* Users = Static JSON FILE  into thenUsers = mongoDB*/}
          {theUsers.filter((userItem) => {
            const fullname = `${userItem.firstName} ${userItem.lastName}`
            return fullname.toLowerCase().includes(query); 
          })
          .map((user, index) => {
            // Show only 4 names
            if (index >= 4 ) { return null; }
            return(
              <ListItem 
                style={{
                  marginLeft: '0.9rem',
                  width: '245px',
                  marginTop: '5px',
                  cursor: 'pointer',
                  height: '65px',
                  whiteSpace: 'nowrap', // avoid wrap text
                  overflow: 'hidden', // sobra ang text sa border
                }}
                 sx={{ '&:hover': { backgroundColor: 'white',  borderRadius: '0.75rem'} }}  
                key={user._id}
                // console.log the ObjectId 
                onClick={() => {  handleNameClick(user._id)}}
              >
                <UserProfile userId={user._id} picturePath={ user.picturePath } />
          
              </ListItem>
            );
          })}
             
        </List>
      </div>) : null
    }
    
    
  </>
  );
};

export default SearchBar;