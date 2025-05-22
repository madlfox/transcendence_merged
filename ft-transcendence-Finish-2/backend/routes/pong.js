// routes/pong.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { ethers } = require('ethers');

// Setup Avalanche provider and contract
const provider = new ethers.JsonRpcProvider(process.env.AVALANCHE_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// ⚠️ Replace with real ABI from Remix after deployment
/*const contractABI = [
  "function recordScore(string username, uint256 score) public"
];*/

const contractABI = require('../contractABI.json');

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

async function pongRoutes(fastify, options) {
  const db = fastify.db; // Assume you have db injected in Fastify

  fastify.post('/api/record_AIpong_match', async (request, reply) => {
    const authHeader = request.headers.authorization;
    console.log("🔐 Authorization Header:", authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ error: 'Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return reply.code(401).send({ error: 'Invalid or expired token' });
  }
  const userId = decoded.id;
    if (!userId) return reply.code(401).send({ error: 'Not authenticated' });

    const { player_one, ai_level, winner, match_score, match_duration, match_date } = request.body;

    if (!player_one || !ai_level || !winner || !match_score || !match_duration || !match_date) {
      return reply.code(400).send({ error: 'Missing fields' });
    }

    try {
      // Insert AI match record
      await db.run(
        `INSERT INTO ai_pong_matches (player_one, ai_level, winner, match_score, match_duration, match_date, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [player_one, ai_level, winner, match_score, match_duration, match_date, userId]
      );

      // Update user's stats
      await db.run(
        `UPDATE users
         SET total_pong_matches = total_pong_matches + 1,
             total_pong_ai_matches = total_pong_ai_matches + 1,
             total_pong_time = total_pong_time + ?
         WHERE id = ?`,
        [match_duration, userId]
      );

      return reply.code(201).send({ success: true });
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: 'Database error' });
    }
  });

  fastify.post('/api/record_PvPong_match', async (request, reply) => {
    const authHeader = request.headers.authorization;
    console.log("🔐 Authorization Header:", authHeader);
    console.log("authHeader →", authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ error: 'Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return reply.code(401).send({ error: 'Invalid or expired token' });
  }
  const userId = decoded.id;
    if (!userId) return reply.code(401).send({ error: 'Not authenticated' });

    const { player_one, player_two, winner, match_score, match_duration, match_date } = request.body;

    if (!player_one || !player_two || !winner || !match_score || !match_duration || !match_date) {
      return reply.code(400).send({ error: 'Missing fields' });
    }

    try {
      await db.run(
        `INSERT INTO pvp_pong_matches (player_one, player_two, winner, match_score, match_duration, match_date, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [player_one, player_two, winner, match_score, match_duration, match_date, userId]
      );

      await db.run(
        `UPDATE users
         SET total_pong_matches = total_pong_matches + 1,
             total_pong_pvp_matches = total_pong_pvp_matches + 1,
             total_pong_time = total_pong_time + ?
         WHERE id = ?`,
        [match_duration, userId]
      );

      return reply.code(201).send({ success: true });
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: 'Database error' });
    }
  });

  fastify.post('/api/record_tournament', async (request, reply) => {
    const authHeader = request.headers.authorization;
    console.log("🔐 Authorization Header:", authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return reply.code(401).send({ error: 'Invalid or expired token' });
    }

    const userId = decoded.id;
    if (!userId) return reply.code(401).send({ error: 'Not authenticated' });

    const { player_one, player_two, player_three, player_four, winner, duration, date } = request.body;

    if (!player_one || !player_two || !player_three || !player_four || !winner || !duration || !date) {
      return reply.code(400).send({ error: 'Missing fields' });
    }

    try {
      // Store in local DB

      const insertedId = await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO pong_tournaments (player_one, player_two, player_three, player_four, winner, duration, date, user_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [player_one, player_two, player_three, player_four, winner, duration, date, userId],
          function (err) {
            if (err) reject(err);
            else resolve(this.lastID); // this is the DB row id
          }
        );
      });
      
      /*await db.run(
        `INSERT INTO pong_tournaments (player_one, player_two, player_three, player_four, winner, duration, date, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [player_one, player_two, player_three, player_four, winner, duration, date, userId]
      );*/

      await db.run(
        `UPDATE users
         SET total_pong_matches = total_pong_matches + 3,
             total_tournament_played = total_tournament_played + 1,
             total_pong_time = total_pong_time + ?
         WHERE id = ?`,
        [duration, userId]
      );

      // ⛓ Record score to blockchain
      //const tx = await contract.recordScore(winner, 1); // Replace `1` with a real score if needed
      //await tx.wait();
      //console.log("📝 Blockchain TX Hash:", tx.hash);


      // ⛓ Record full match data to blockchain using recordMatch()
      const tx = await contract.recordMatch(
        insertedId,
        player_one,
        player_two,
        player_three,
        player_four,
        winner,
        duration,
        date,
        userId
      );
      await tx.wait();
      
      console.log("📝 Blockchain TX Hash:", tx.hash);      


      // ⛓ Record hash of full match data to blockchain
      /*const matchData = {
        id: insertedId, // get it after inserting into DB
        player_one,
        player_two,
        player_three,
        player_four,
        winner,
        duration,
        date,
      };

      const matchString = JSON.stringify(matchData);
      const matchHash = ethers.keccak256(ethers.toUtf8Bytes(matchString));

      const tx = await contract.recordScore(matchHash);
      await tx.wait();

      console.log("📝 Blockchain TX Hash:", tx.hash);*/

      return reply.code(201).send({ success: true, txHash: tx.hash });
    } catch (err) {
      console.error("❌ Error:", err);
      return reply.code(500).send({ error: 'Database or blockchain error' });
    }
  });

  /*fastify.post('/api/record_tournament', async (request, reply) => {
    const authHeader = request.headers.authorization;
    console.log("🔐 Authorization Header:", authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ error: 'Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return reply.code(401).send({ error: 'Invalid or expired token' });
  }
  const userId = decoded.id;
    if (!userId) return reply.code(401).send({ error: 'Not authenticated' });

    const { player_one, player_two, player_three, player_four, winner, duration, date } = request.body;

    if (!player_one || !player_two || !player_three || !player_four || !winner || !duration || !date) {
      return reply.code(400).send({ error: 'Missing fields' });
    }

    try {
      await db.run(
        `INSERT INTO pong_tournaments (player_one, player_two, player_three, player_four, winner, duration, date, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [player_one, player_two, player_three, player_four, winner, duration, date, userId]
      );

      await db.run(
        `UPDATE users
         SET total_pong_matches = total_pong_matches + 3,
             total_tournament_played = total_tournament_played + 1,
             total_pong_time = total_pong_time + ?
         WHERE id = ?`,
        [duration, userId]
      );

      return reply.code(201).send({ success: true });
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: 'Database error' });
    }
  });*/
}

module.exports = pongRoutes;
