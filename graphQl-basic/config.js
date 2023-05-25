export const MONGO_URL="mongodb+srv://anandkushwaha:789aditya729A@cluster0.kd7udhp.mongodb.net/GraphQL?retryWrites=true&w=majority"

export let users = [
  {
    id: "1",
    name: "Anand",
    email: "anandkushwaha70@gmail.com",
    age: 24,
  },
  {
    id: "2",
    name: "Aditya",
    email: "aditya70@gmail.com",
    age: 15,
  },
  {
    id: "3",
    name: "Aditya",
    email: "aditya70@gmail.com",
    age: 15,
  }
];

export let posts = [
  {
    id: "12",
    title: "A book",
    body: "This is my Story",
    published: "1/2/2002",
    author: "1",
  },
  {
    id: "121",
    title: "A Women",
    body: "The Mother",
    published: "1/2/1900",
    author: "2",
  },
];

export let comment =[{
    id:'2',
    textField:'Nice Book',
    author:'1',
    post:'12'
},{
    id:'3',
    textField:"Amazing Movie",
    author:'2',
    post:'121'

}]