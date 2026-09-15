# CodeMeet&#8203;.io

CodeMeet.&#8203;io is a mock technical interview platform designed to help users prepare for coding interviews through individual practice and real-time interview sessions. Users can solve coding problems using an in-browser Monaco code editor, execute and submit solutions in a sandboxed Docker environment, and collaborate with other participants through live interview rooms. Interview rooms use Socket.&#8203;IO for real-time synchronization of code, problems, test cases, and participant state, while WebRTC provides multi-user video and audio communication. Rooms can be shared through a link, allowing participants to join an interview session without requiring scheduling or pairing. This platform provides the tools needed for low-friction technical interview practice.

## Tech Stack

**Frontend**

The frontend is built with Next.js and TypeScript, using React for component-based UI development. Material UI is used for application components and styling, while Monaco Editor provides the in-browser code editor.

**Backend**

The backend is built with Node.js and Express, providing REST APIs for authentication, problems, code execution, and submissions. MongoDB is used to store application data such as users and coding problems, with Mongoose providing schema definitions and database interaction. Socket.&#8203;IO is used for real-time communication between participants, synchronizing interview state and handling WebRTC signaling. WebRTC provides peer-to-peer video and audio communication between participants in interview rooms.


**Code Execution**

Python is used to execute submitted coding solutions, with Docker providing isolated sandbox environments for running user code. The execution pipeline handles test case evaluation, execution timeouts, and runtime errors before returning the results to the frontend.


## [Problem Dataset](https://github.com/neenza/leetcode-problems/tree/master/problems)

A custom importer transforms the dataset into the CodeMeet database format by:
- Extracting Python function metadata
- Converting Python types into application-supported types
- Parsing sample test cases
- Validating supported problems before import

## Features

**Code Editor & Execution**

Users can write, run, and submit Python solutions directly in the browser using the Monaco Editor. Code execution is handled by an Express backend that runs submissions inside isolated Docker containers, with Python responsible for executing the solution against the provided test cases. Submissions are evaluated against hidden test cases to determine whether the solution is correct.

**Real-Time Collaborative Coding**

Interview participants can work together in the same coding environment with changes synchronized in real time using Socket.&#8203;IO. Code changes, cursor positions, selected problems, timers, and test cases are synchronized across participants, allowing all users in a room to share the same interview state.

**Video & Audio Communication**

Interview rooms support multi-user video and audio communication using WebRTC. A mesh architecture maintains a separate `RTCPeerConnection` for each participant, while Socket.&#8203;IO handles WebRTC signaling, including offer/answer exchange and ICE candidates. The interface supports up to five participants with synchronized microphone and camera states.

**Interview Rooms**

Users can create or join interview rooms through shareable links without requiring scheduling or pairing. Room state is maintained in memory and synchronized through Socket.&#8203;IO, allowing participants to join an active session and immediately receive the current problem, code, test cases, and participant state.

**Problem Management**

Coding problems are imported from a LeetCode problem dataset and transformed into the application's database format through a custom importer. The importer extracts Python function metadata, converts supported parameter and return types, parses sample test cases, and validates problems before they are added to the database.

**Authentication**

Users can create accounts and authenticate through a JWT-based authentication system. Authentication state is maintained through HTTP-only cookies, with the backend handling account creation, login, and protected API access. Unauthenticated users cannot run or submit code.

## Limitations

**Limited Problem Types**
The current implementation supports a subset of coding problems due to limitations in the problem parsing and execution pipeline. Problems that require custom data structures, such as tree or linked-list problems that depend on `Node` objects, are not currently supported despite these problems being common in technical interviews.

**Output Validation Limitations**
There are also limitations in how submitted solutions are evaluated. Some problems allow multiple valid representations of the same result, such as solutions where the ordering of values does not matter. For example, if `[1, 7]` is an accepted result, `[7, 1]` should also be considered correct. The current evaluation system does not fully account for these types of equivalent outputs.

**Python-Only Execution**
The execution pipeline currently supports Python solutions only. The problem importer and execution runner are built around Python function definitions and Python-specific metadata. However, the pipeline was designed with extensible language support in mind.

**WebRTC Connectivity Depends on P2P Networking**
The video/audio system uses a mesh WebRTC architecture, meaning each participant maintains a peer connection with every other participant. This works well for the intended small room size, but connectivity can be affected by network conditions and restrictive NAT/firewall configurations because the current implementation does not use a TURN server.




## Future Improvements and Features

**AI-Powered Code Review**
Analyze submitted solutions for time/space complexity, code quality/style, and potential improvements.

**Expanded Problem Support**
Add support for additional problem types, including problems involving trees, linked lists, graphs, and other custom data structures.

**Improved Output Validation**
Support problems with multiple valid outputs, unordered results, and other problem-specific validation requirements.

**Interview Performance Tracking**
Track solution results, completion times, and other metrics to provide users with insight into their interview performance.

**WebRTC Reliability Improvements**
Add TURN server support to provide a fallback for participants whose networks prevent direct peer-to-peer connections.

**CRDT-Based Code Synchronization**
Integrate Yjs as a CRDT-based synchronization layer for the code editor, replacing the current Socket&#8203;.io-based editor synchronization.
