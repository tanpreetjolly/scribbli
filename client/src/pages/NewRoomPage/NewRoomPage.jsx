import './NewRoomPage.scss';
import { useEffect, useState } from 'react';
import { useContext } from 'react';

import { SocketContext } from '../../context/socket';

import { useNavigate } from 'react-router-dom';
import { RoomIdContext } from '../../context/roomid';
import { PlayersContext } from '../../context/players';
import usePlayerTurnId from '../../store/playerTurnStore';

const NewRoomPage = () => {
  const socket = useContext(SocketContext);
  const roomIdContext = useContext(RoomIdContext);
  const playersContext = useContext(PlayersContext);
  const [socketID] = useState(socket.id);
  const navigate = useNavigate();
  const setPlayerTurnId = usePlayerTurnId((state) => state.setPlayerTurnId);
  console.log("setPlayerTurnId", setPlayerTurnId);

  console.log(playersContext.players);

  useEffect(() => {
    roomIdContext.setRoomID(socketID);
    playersContext.setPlayers([socketID]);

    socket.on("start", (data) => {
      setPlayerTurnId(data.playerTurn);
      console.log("start", data.playerTurn);
      navigate("/DrawingPage");
    })

    socket.on("players-event", (players) => {
      console.log(players)
      playersContext.setPlayers(players);
    })
  }, [])

  const handleStart = () => {
    socket.emit("start", socketID);
    navigate("/DrawingPage")
  }

  return (
    <div className="new-room-page">
      <div>Players in Room: {playersContext.players.length}</div>
      <div>New Room Unique ID : {socketID}</div>
      <div>Copy the ID</div>
      <div>Waiting for users to join...</div>
      <button onClick={handleStart}>Start</button>
    </div>
  )
}

export default NewRoomPage;