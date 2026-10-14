// Edit each note here: its filename, opening state, and the exact text to display.
// Order here is also the order in the Browse menu. Copy a block to add a note.
// No config generation or later overrides: what you write is what readers see.
const NOTES = [
  {
    file: 'how-it-started.md',
    open: false,
    featured: true,
    source: `
# How it started 

Back in September 2026, it was a day like any other.
I was debugging something that required me to work
in multiple windows at once: my tmux, a browser and
an admin tool. This endless going back and forward, 
having to exit my terminal and use my mouse (ew) to 
click-navigate through logs and the admin tool (with 
multiple windows scattered all over the place), was
draining me in way. 

And that day i realized what it was. You can probably
guess it had something to do with spreading your 
attention to thin, context switching etc. etc. And you
would be right, but i want to be more specific: 

**it was the endless recuring pauses**.

Between making progress on each little sub-quest 
(reading this function, this log, this config etc) 
i had to get of the "thought-train" and stop to find 
out where to go next. Well not exactly - i almost 
knew instantly *where to go* - but then navigating 
to that place (especially outside the terminal) was 
almost a task in it self. Thats what felt draining 
that day. 

There is no removing the pauses completely, but 
they could be *smoothed* some amount. I wanted all
these key resources at the tips of my fingers, in
my terminal, much like a normal CLI tool, so i could
quickly just type "logs live that-service" and that
would take me there with no additional clicking. 

I also realised that coding a custom CLI tool just 
for that purpose would not scale well. Any time
i would want to expand it - i would have to code
some more. So instead, the right solution felt more 
like keeping the key resources in lists and then
build a tool that could convert those lists into 
CLI tool calls.

Thats how it started. 

Eventually those lists turned into config files such
that special behaviors like custom hooks for opening
specific files or dirs, quickly running scripts or 
selecting specific browsers for specific bookmarks 
was possible. The term "Quick Resource Locator" was 
just an analog to Unique Resource Locators (URLs)
and the postfix "kit" was added to it: qrlkit.

The tool is available to anyone on github and its
pretty simple. What i like most about it is how
easy it is to add new resources and thus smooth out
even more things. Its pretty addicting for someone
like me. Maybe someone like you. 

Hope it helps, check it out:
https://github.com/qrlkit/qrlkit-rs

`,
  },
  {
    file: 'qrlkit-cli.md',
    open: false,
    source: `
# Here is a list of the current \`qrlkit\` cli commands: 

Browse or open a resource
\`\`\`
$ qrlkit [keys…]
\`\`\`

Use a separate state file for debugging
\`\`\`
$ qrlkit --config <path> …
\`\`\`

Register configs and set up root commands
\`\`\`
$ qrlkit add <file-or-directory>
\`\`\`

List registered config files
\`\`\`
$ qrlkit ls
\`\`\`

Remove a key and everything under it; omit keys to choose
\`\`\`
$ qrlkit rm [keys…]
\`\`\`

Refresh imports and retry shell setup
\`\`\`
$ qrlkit reload
\`\`\`

Choose \`merge\` (default) to combine shared namespaces or \`rename\` to rename conflicting roots
\`\`\`
$ qrlkit set-collision-strategy <strategy>
\`\`\`

Choose the default browser
\`\`\`
$ qrlkit set-browser
\`\`\`

Choose the default file action (\`--clear\` restores path printing)
\`\`\`
$ qrlkit set-filehook <command>
\`\`\`

Choose the directory hook (\`--clear\` restores changing directory)
\`\`\`
$ qrlkit set-dirhook <command>
\`\`\`

Choose browser, shell, filehook, and dirhook interactively
\`\`\`
$ qrlkit init
\`\`\`

Print the directory wrapper for manual setup
\`\`\`
$ qrlkit init <shell>
\`\`\`

Reset imports, renames, browser selection, and hooks
\`\`\`
$ qrlkit nuke
\`\`\`

Show help
\`\`\`
$ qrlkit --help
\`\`\`
`,
  },
  {
    file: 'install.toml',
    open: false,
    source: `# Installing qrlkit is now pretty easy

# Package managers
$ cargo install qrlkit
$ npm i -g qrlkit
$ bun add -g qrlkit
$ yarn global add qrlkit

# Latest Linux or macOS release
$ curl -fsSL https://raw.githubusercontent.com/qrlkit/qrlkit-rs/main/install.sh | sh

# Build from source
$ git clone git@github.com:qrlkit/qrlkit-rs.git
$ cd qrlkit-rs
$ cargo install --path .
`,
  },
];
