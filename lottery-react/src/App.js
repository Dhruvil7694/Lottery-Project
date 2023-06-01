import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
  state = {
    //state component used in new ES6 format.
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call(); //getting manager information using manager() method written in Lottery.sol
    const players = await lottery.methods.getPlayers().call(); //getting players using getPlayer method written in Lottery.sol
    const balance = await web3.eth.getBalance(lottery.options.address); // this is actually an object which is wrapped in library called 'Big number JS' .
    this.setState({ manager, players, balance });
  }

  //onSubmit is also a method having different format but the value of this will be autmatically set for us to be equal to our component. we dont have to worry about binding on submit down int he render function.
  onSubmit = async (event) => {
    // eventis a object which represents the form submission.
    event.preventDefault(); //this function form to not get submitted in classic HTML .
    //HERE, initially we do have to get list of our account present in the lottery.
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "your transaction is being progressed...." });

    await lottery.methods.enter().send({
      // these four line of code will actually take 15-30 seconds to
      from: accounts[0], // run the transaction. this is the code to enter the lottery.
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({message:"Your transaction is SUCCESSFULL!, you have entered the lotter!!!"});
  };
  onClick = async () => {
    //HERE, initially we do have to get list of our account present in the lottery.
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "your transaction is being progressed...." });

    await lottery.methods.pickWinner().send({
      // these four line of code will actually take 15-30 seconds to
      from: accounts[0], // run the transaction. this is the code to enter the lottery.
    });

    this.setState({ message: "Winner has been picked!"});
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager} . There are currently{" "}
          {this.state.players.length} people are entered, competing to win{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} amount of ether!.
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>
            Want to try your <b>LUCK?</b>
          </h4>
          <div>
            <label> Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })} //onchange event to change the value of ether entered at run time. we have enitilize value for the amount entered. and specify in the state.
            />
          </div>
          <br />
          <button>
            <b>Enter</b>
          </button>
        </form>
        <hr />
        <h2><b>Ready to pick winner?</b></h2>
        <button onClick={this.onClick}>Pick Winner</button>

        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
