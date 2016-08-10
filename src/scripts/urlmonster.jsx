var UrlRawInput = React.createClass({
    render: function() {
        var handleChange = function(e){
            console.log(e);
        };
        return (
            <div className="urlRawInput">
                <input 
                    className="url"
                    type="text"
                    value={this.props.url.getUrl()}
                    onchange={handleChange}
                    />
                <div>ker</div>
            </div>
        );
    }
});

var UrlRawPanel = React.createClass({
    render: function() {
        return (
            <div className="urlRawPanel">
                <UrlRawInput url={this.props.url0} upd={this.props.upd} />
                <UrlRawInput url={this.props.url1} upd={this.props.upd} />
            </div>
        );
    }
});

var UrlParsedPanel = React.createClass({
    render: function() {
        return (
            <div>
            </div>
        );
    }
});

var Monster = React.createClass({
    getInitialState: function() {
        return {
            url0: new URL(),
            url1: new URL()
        };
    },
    render: function() {
        var that = this;
        var updateFun = function(){
            that.forceUpdate();
        };
        return (
                <div>
                    <UrlRawPanel url0={this.state.url0} url1={this.state.url1} upd={updateFun} />
                    <UrlParsedPanel />
                </div>
            );
    }
});

ReactDOM.render(
  <Monster />,
  document.getElementById('wrapper')
);
