

import {useState,useEffect} from 'react';
 
const Gallery =()=> {

const [pics,setPics] =useState([])
const [guy, setGuy]=useState({})

const url = 'https://maybeart.app/api/gallery/all'
const allUsers = 'https://maybeart.app/api/users'
const sushi = 'https://maybeart.app/api/nft-metadata/68'

useEffect(() => {
  console.log("Fetching from:", url);
  

  fetch(sushi)
  .then(res=> res.json)
  .then(data => {
    console.log('THis===>',data);
    setGuy(data)
  })
  .catch(err=> console.error("ERror",err))


//   fetch(url)
//     .then(res => res.json()) 
//     .then(data => {
//       console.log("Full data:", data);
//       console.log("Gallery array:", data.gallery);
//       setPics(data.gallery);
//     })
//     .catch(err => console.error("Error:", err));

    // fetch(allUsers)
    // .then(res => res.json())
    // .then(data => {
    //   console.log("data",data);

    // })
    // .catch(err=> console.error("error:",err))
}, []);

return (



    <div> 
     <h1> Yo MuthaFucka</h1>



        <section> 


            {/* <img src = {guy.imageUrl} */}
        </section>
      {/* {pics.map((e:any)=>  ( 
      
      <div 
      key={e.id}
      
      >

        <img src ={e.imageUrl}/> 
        <h2>{e.title}</h2>

        </div>



      ))} */}




    </div>
)







}


export default Gallery