const { users, posts, comments } = require('./data');
const { GraphQLServer, PubSub } = require('graphql-yoga');
const typeDefs = `
type User{
    id:ID!
    fullName:String!
    posts:[Post!]!
    comments:[Comment!]!
}
type Post{
    id:ID!
    title:String!
    user_id:ID!
    user:User!
    comments:[Comment!]!
}
type DeleteAllElements{
    count:Int!
}
input createUserInput{
    fullName:String!
}

input createPostInput{
    title:String,
    user_id:ID!
}
input UpdateUserInput{
fullName:String
age:Int
}
input UpdatCommentInput{
    text:String,
    user_id:ID,
    post_id:ID  
}
input UpdatePostInput{
    title:String,
    user_id:ID 
}

input createCommentInput{
    text:String!,
    user_id:ID!,
    post_id:ID!
}

type Comment{
    id:ID!
    text:String
    post_id:ID!
    user:User!
    post:Post!
}
type Query{
    users:[User!]
    posts:[Post!]
    comments:[Comment!]!
    user(id:ID!):User!
    comment(id:ID!):Comment!
    post(id:ID!):Post!
}
type Mutation{
    #User
    createUser(data:createUserInput!):User!
    updateUser(id: ID!, data: UpdateUserInput!): User!
    deleteUser(id:ID!):User!
    deleteAllUser:DeleteAllElements!
    
    #Post
    createPost(data:createPostInput!):Post!
    updatePost(id: ID!, data: UpdatePostInput!): Post!
    deletePost(id:ID!):Post!
    deleteAllPost:DeleteAllElements!

    #Comment
    createComment(data:createCommentInput!):Comment
    updateComment(id: ID!, data: UpdatCommentInput!): Comment!
    deleteComment(id:ID!):Comment!
    deleteAllComment:DeleteAllElements!

}
`;
const resolvers = {
    Mutation: {
        //User
        createUser: (parent, { data }) => {
            const user = { id: Math.trunc(Math.random() * 10), fullName: data.fullName }
            users.push(user);
            return user;
        },
        updateUser: (parent, { id, data }) => {
            const user_index = users.findIndex(user => user.id === id);
            if (user_index === -1) {
                throw new Error('User not found');
            };
            const update_user = users[user_index] = {
                ...users[user_index],
                ...data
            }
            return update_user;
        },
        deleteUser: (parent, { id }) => {
            const user_index = users.findIndex(user => user.id === id);
            if (user_index === -1) {
                throw new Error('User not found')
            }
            const deleted_user = users[user_index];
            users.splice(user_index, 1)
            return deleted_user
        },
        deleteAllUser: () => {
            const lenght = users.length;
            users = [];
            return {
                count: lenght
            }
        },

        //Post
        createPost: (parent, { data }) => {
            const post = {
                id: Math.trunc(Math.random() * 10),
                title: data.title,
                user_id: data.user_id
            }
            posts.push(post);
            return post;
        },
        updatePost: (parent, { id, data }) => {
            const post_index = posts.findIndex(post => post.id === id);
            if (post_index === -1) {
                throw new Error('Post not found');
            };
            const update_post = posts[post_index] = {
                ...posts[post_index],
                ...data
            }
            return update_post;
        },
        deletePost: (parent, { id }) => {
            const post_index = posts.findIndex(post => post.id === id);
            if (user_index === -1) {
                throw new Error('Post not found')
            }
            const deleted_post = posts[post_index];
            posts.splice(post_index, 1)
            return deleted_post
        },
        deleteAllPost: () => {
            const lenght = posts.length;
            posts = [];
            return {
                count: lenght
            }
        },

        //Comment
        createComment: (parent, { data }) => {
            const comment = {
                id: Math.trunc(Math.random() * 10),
                text: data.text,
                user_id: data.user_id,
                post_id: data.post_id
            }
            comments.push(comment);
            return comment;
        },
        updateComment: (parent, { id, data }) => {
            const comment_index = comments.findIndex(comment => comment.id === id);
            if (comment_index === -1) {
                throw new Error('Post not found');
            };
            const update_comment = comments[comment_index] = {
                ...comments[comment_index],
                ...data
            }
            return update_comment;
        },
        deleteComment: (parent, { id }) => {
            const comment_index = comments.findIndex(comment => comment.id === id);
            if (comment_index === -1) {
                throw new Error('Comment not found')
            }
            const deleted_comment = comments[comment_index];
            comments.splice(comment_index, 1)
            return deleted_comment
        },
        deleteAllComment: () => {
            const lenght = comments.length;
            comments = [];
            return {
                count: lenght
            }
        },

    },
    Query: {
        users: () => users,
        posts: () => posts,
        comments: () => comments,
        user: (parent, args) => {
            const data = users.find(item => item.id === args.id);
            return data;
        },
        comment: (parent, args) => {
            const data = comments.find(item => item.id === args.id);
            return data;
        },
        post: (parent, args) => {
            const data = posts.find(item => item.id === args.id);
            return data;
        },
    },
    User: {
        posts: (parent) => posts.filter(item => item.user_id === parent.id),
        comments: (parent) => comments.filter(item => item.user_id === parent.id)
    },
    Post: {
        user: (parent) => users.find(item => item.post_id === parent.id),
        comments: (parent) => comments.filter(item => item.post_id === parent.id)
    },
    Comment: {
        user: (parent) => users.find(item => item.id === parent.user_id),
        post: (parent) => posts.find(item => item.id === parent.user_id)
    }
};



const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });
server.start(() => console.log('Server start'));
