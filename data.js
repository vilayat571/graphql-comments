const users = [
    {
        id: "1",
        fullName: "Mehmet Seven"
    },
    {
        id: "2",
        fullName: "Ahmet Gunal"
    }
];
const posts = [
    {
        id: "1",
        title: "Mehmet'in gonderisi",
        user_id: "1"
    },
    {
        id: "2",
        title: "Mehmet'in diger gonderisi",
        user_id: "1"
    },
    {
        id: "3",
        title: "Ahmet'in gonderisi",
        user_id: "2"
    }
];
const comments = [
    {
        id: "1",
        text: "Lorem ipsum",
        post_id: "1",
        user_id:"2"
    },
    {
        id: "2",
        text: "Lorem ipsum doler",
        post_id: "1",
        user_id:"1"
    },
    {
        id: "3",
        text: "foo bar",
        post_id: "2",
        user_id:"2"
    },
    {
        id: "4",
        text: "foo bar baz",
        post_id: "3",
        user_id:"1"
    },
];

module.exports = {
    users,
    posts,
    comments
};