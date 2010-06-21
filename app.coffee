sys: require('sys')
ws: require('./ws')
kiwi: require('kiwi')

kiwi.require('express')
kiwi.seed('mongodb-native')
require('express/plugins')

NoteProvider: require('./noteprovider-mongodb').NoteProvider
noteProvider: new NoteProvider('127.0.0.1', 27017)


configure( ->
  use(MethodOverride)
  use(ContentLength)
  use(Logger)
  use(Static, {path: require("path").join(__dirname, "public")})
  set('root', __dirname)
)

get('/', ->
  self: this
  noteProvider.save([{content: ''}], (error, note)->
    sys.puts("Error: "+error) if error != null
    note_id: note._id.toHexString() if note != undefined
    self.redirect('/note/'+note_id)
    ))

get('/note/*', (id) ->
  self: this
  noteProvider.findById(id, (error, note) ->
    sys.puts('Error: '+error) if error != null
    self.render('note.html.haml', {locals: {note: note}})
  ))

get('/js/*', (file) ->
  this.sendfile(__dirname + '/public/js/' + file))

get('/css/*', (file) ->
  this.sendfile(__dirname + '/public/js/' + file))

run()

# The web sockets part now

wsserver: ws.createServer((socket) ->
  socket.addListener('connect', (resource) ->
    sys.puts('client connected from' + resource)
    socket.write('{welcome}')
  )

  socket.addListener('data', (data) ->
    socket.write(data)
    parsed_data: {id: data.split(':')[0], content: data.split(':')[1]}
    noteProvider.findById(parsed_data.id, (error, note) ->
      sys.puts('Error: '+error) if error != null
      noteProvider.getCollection( (error, collection)->
        noteProvider.findById(parsed_data.id, (error, note)->
          collection.update(note, {content: parsed_data.content})
        )
      )
    )
    sys.puts(data)
  )

  socket.addListener('close', (data) ->
    sys.puts('client left')
  )
)

wsserver.listen(8080)
