"use strict";

var React = require('react');
var AuthorForm = require('./authorForm');
var AuthorActions = require('../../actions/authorActions');
var AuthorStore = require('../../stores/authorStore');
var Router = require('react-router');
var toastr = require('toastr');


var ManageAuthorPage = React.createClass({

    mixins: [  //Må hete mixins
        Router.Navigation
    ],

    statics: {
        willTransitionFrom: function (transition, component) {
            if (component.state.dirty && !confirm('Leave without saving')) {
                transition.abort();
            }
        }
    },

    getInitialState: function () {
        return {
            author: { id: '', firstName: '', lastName: ''},
            errors: {},
            dirty: false
        };
    },

    componentWillMount: function () {
        var authorId = this.props.params.id; //from the path 'author:id'

        if (authorId){
          this.setState({author: AuthorStore.getAuthorById(authorId)});
        }

    },

    setAuthorState22: function (event) {   //Blir kalt hver gang man taster en knapp
        this.setState({dirty: true});
        var field = event.target.name;
        var value = event.target.value;
        this.state.author[field] = value;
        console.log(this.state.author);
        return this.setState({author: this.state.author});
    },

    authorFormIsValid: function () {
      var formIsValid = true;
      this.state.errors = {}; //clear previous errors

      if (this.state.author.firstName.length < 3) {
        this.state.errors.firstName = 'First name must be 3 characters';
        formIsValid = false;
      }

      if (this.state.author.lastName.length < 3) {
        this.state.errors.lastName = 'First name must be 3 characters';
        formIsValid = false;
      }
      this.setState({errors: this.state.errors});
      return formIsValid;
    },

    saveAuthor: function (event) { //sender event fra childcomponent til denne
        event.preventDefault(); //Vil ikke at default browserlogikk skal skje her
        if (!this.authorFormIsValid()) {
          return;
        }
        if (this.state.author.id ) {
          AuthorActions.updateAuthor(this.state.author);
        } else {
          AuthorActions.createAuthor(this.state.author);
        }

        this.setState({dirty: false});
        toastr.success('Author saved. ');
        this.transitionTo('authors');

    },

    render: function () {
        return (
          <div>
            <AuthorForm
                author={this.state.author}
                onChange={this.setAuthorState22}
                onSave={this.saveAuthor}
                errors={this.state.errors}
                />
          </div>
        );
    }
});

module.exports = ManageAuthorPage;
