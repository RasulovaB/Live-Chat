// adding new chat documents

// setting up a real-time listener to get new chats

// updating the username

// updating the room

class Chatroom {
    constructor(room, username){
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }
    async addChat(message){
        // format a chat object
        // when we save in collection we save it as js object
        const now = new Date();// to access date when user submit
        const chat = {
            message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };
        // save the chat dcument
        const response = await this.chats.add(chat);
        return response;
    }

    // adding a realtime listener
    getChats(callback){
        this.unsub = this.chats
        // to get document from a certain collection use .where()
            .where('room', '==', this.room)
            .orderBy('created_at')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if(change.type === 'added'){
                        //update the ui
                        callback(change.doc.data());
                    }
                });
            });
    }
    updateName(username){
        this.username = username;
        localStorage.setItem('username', username);
    }
    updateRoom(room){
        this.room = room;
        console.log('room updated');
        if(this.unsub){
            this.unsub();
        }
    }
}

// const chatroom = new Chatroom('general', 'paul');
// // console.log(chatrrom);

// // chatroom.addChat('hello everyone')
// //     .then(() => console.log('chat added'))
// //     .catch(err => console.log(err));

// chatroom.getChats((data) => {
//     console.log(data);// shows added/all documents from database/ retrieving all documents back
// });

// setTimeout(() => {
//     chatroom.updateRoom('gaming');
//     chatroom.updateName('Jane');
//     chatroom.getChats((data) => {
//         console.log(data);
//     });
//     chatroom.addChat('Privet');
// }, 3000);