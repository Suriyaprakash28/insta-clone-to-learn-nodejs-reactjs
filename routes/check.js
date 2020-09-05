const bccrypt=require('bcryptjs')
pp='$2a$12$9O0aDOaO0kUIJNZW8IXlA.t4fMZPbTWC0qaD0add6NAB5sBe3BrcS'
ppp='$2y$12$ciU/m8HtbFLxLrQjswP78OM/JwEEpcGdmeXZOFn1YK4JqzXizo30S'
array=["suriya","suriyasharmila","12345678","Suriya","Sharmila","Sharmilasuriya","Suriyasharmila","sharmilasuriyaprakash","Sharmilasuriyaprakash","Borntofly",
]
array.forEach(element => {
    bccrypt.compare(element,ppp).then(dd=>{
        if(dd){
            console.log(element+"\t is your decrypted password");
        }
        
    })
});