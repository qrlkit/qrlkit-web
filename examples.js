const THEMES = {
  'Tokyo Night': ['#1a1b26','#a9b1d6','#626b93','#7aa2f7','#bb9af7','#9ece6a'],
  'Catppuccin Mocha': ['#1e1e2e','#cdd6f4','#7f849c','#cba6f7','#89b4fa','#a6e3a1'],
  'Darcula': ['#2b2b2b','#a9b7c6','#777777','#cc7832','#ffc66d','#a5c08c'],
  'Nord': ['#2e3440','#d8dee9','#8290a7','#88c0d0','#81a1c1','#a3be8c'],
  'Dracula': ['#282a36','#f8f8f2','#8890b5','#bd93f9','#ff79c6','#f1fa8c'],
  'Gruvbox': ['#282828','#ebdbb2','#a89984','#fe8019','#83a598','#b8bb26'],
  'One Dark': ['#282c34','#abb2bf','#7f8796','#c678dd','#e06c75','#98c379'],
  'Rose Pine': ['#191724','#e0def4','#908caa','#c4a7e7','#ebbcba','#9ccfd8'],
  'Catppuccin Latte': ['#e8e4ef','#4c4f69','#81849a','#8839ef','#1e66f5','#408443'],
  'Solarized Light': ['#eee8d5','#586e75','#889b9d','#b58900','#268bd2','#698900'],
  'Everforest': ['#2d353b','#d3c6aa','#859289','#a7c080','#7fbbb3','#dbbc7f'],
  'Kanagawa': ['#1f1f28','#dcd7ba','#8a8895','#957fb8','#7e9cd8','#98bb6c'],
  'Night Owl': ['#011627','#d6deeb','#7a939f','#c792ea','#82aaff','#addb67'],
  'Catppuccin Macchiato': ['#24273a','#cad3f5','#8087a2','#f5bde6','#8aadf4','#a6da95'],
  'Rose Pine Dawn': ['#f2e9e1','#575279','#9893a5','#907aa9','#b4637a','#286983'],
};

// Each topic has nine main examples and six alternate-format examples. Configs remain plain data; filenames,
// feature notes, and palettes are presentation metadata, never config fields.
const example = (file, note, config) => ({ file, note, config });
const tool = (name, resources) => ({ __customize: { alias: name }, ...resources });
const script = (name, command, shell) => ({ [name]: { $run: command, ...(shell ? { $shell: shell } : {}) } });
const FEATURES = [
  {
    id: 'cli', superstar: 'logs.toml', label: 'CLI', title: 'A file becomes your tool.',
    caption: 'QRL lets you build and run your own tools. Use `qrl add <file>` to turn a config into a small CLI.',
    examples: [
      example('resources.yaml', 'Keys become commands.\nTry: qrl work docs api', {work:{docs:{api:'https://docs.github.com/en/rest',guide:'https://developer.mozilla.org'}}}),
      example('logs.toml', 'Name your tool. Skip the qrl prefix.\nTry: logs prod api', tool('logs',{prod:{api:'https://app.datadoghq.com/logs?query=service%3Aapi',worker:'https://app.datadoghq.com/logs?query=service%3Aworker'}})),
      example('toolkit.toml', 'Prefer TOML? Sections become groups.', tool('kit',{links:{docs:'https://docs.rs'},dir:{repo:'~/work/kit'}})),
      example('toolkit.yaml', 'Prefer YAML? Indent your resources.', tool('kit',{links:{docs:'https://docs.rs'},dir:{repo:'~/work/kit'}})),
      example('toolkit.json', 'Prefer JSON? The same resource tree.', tool('kit',{links:{docs:'https://docs.rs'},dir:{repo:'~/work/kit'}})),
      example('browse.yaml', 'Stop at a group to browse its menu.\nTry: qrl engineering', {engineering:{docs:'https://developer.mozilla.org',status:'https://www.githubstatus.com',repo:'~/work/engineering'}}),
      example('personal.toml', 'Give each config its own command.', tool('homekit',{read:{news:'https://news.ycombinator.com'},dir:{notes:'~/notes'}})),
      example('workspace.yaml', 'Links, paths, and scripts live together.', {project:{docs:'https://developer.mozilla.org',repo:'~/work/project',...script('test','npm test')}}),
      example('shortcuts.toml', 'Edit your config. QRL reloads it\nautomatically before the next use.', {links:{issues:'https://github.com/issues',reviews:'https://github.com/pulls'}}),
    ],
  },
  {
    id:'urls', superstar: 'environments.toml', label:'URLs', title:'Bookmarks in git and links at your fingertips',
    caption:'All your dashboards, tools, docs, and entertainment at your fingertips. QRL tools automatically open links in your fav browser or edge.',
    examples:[
      example('bookmarks.toml','Embed bookmarks directly in your tool.',tool({links:{github:'https://github.com',figma:'https://figma.com',docs:'https://developer.mozilla.org'}})),
      example('monitoring.yaml','All your dashboards in one place.',{monitor:{metrics:'https://play.grafana.org',errors:'https://sentry.io',uptime:'https://www.githubstatus.com'}}),
      example('environments.toml','Filter Datadog logs by environment.\nTry: qrl logs api staging', {logs:{api:'https://app.datadoghq.com/logs?query=service%3Aapi%20env%3A{env}'}}),
      example('reading.json','Your favorite dev blogs and news.',{read:{news:'https://news.ycombinator.com',rust:'https://blog.rust-lang.org',github:'https://github.blog'}}),
      example('work.yaml','Open Microsoft Learn in Edge.',{work:{learn:{$url:'https://learn.microsoft.com',$browser:'Microsoft Edge'}}}),
      example('platforms.yaml','Choose a host, owner, and repository.\nTry: qrl repo issues github.com kubernetes kubernetes',{repo:{issues:'https://{domain}/{owner}/{repo}/issues'}}),
      example('requests.toml','Find a request in your Datadog logs.\nTry: qrl trace request prod abc123',{trace:{request:'https://app.datadoghq.com/logs?query=env%3A{env}%20%40request_id%3A{id}'}}),
      example('after-hours.json','A few shortcuts for after work.',{relax:{music:'https://music.youtube.com',watch:'https://www.youtube.com',read:'https://lobste.rs'}}),
      example('search.yaml','Leave a parameter out and QRL asks.\nTry: qrl search docs',{search:{docs:'https://docs.rs/releases/search?query={term}'}}),
    ],
  },
  {
    id:'paths', superstar: 'editors.yaml',label:'Files',title:'Jump to dirs or bookmark certain files',
    caption:'Quickly jump to key directories or shortcut special file paths. Keep projects, notes, editor configs one command away.',
    examples:[
      example('projects.toml','Jump to your project directory.\nTry: qrl dir api',{dir:{api:'~/work/api',web:'~/work/web'}}),
      example('editors.yaml','Print a config path for your editor.\nTry: nvim $(qrl config nvim)',{config:{nvim:'~/.config/nvim/init.lua',tmux:'~/.tmux.conf',zsh:'~/.zshrc'}}),
      example('repos.json','One shortcut, many repositories.\nTry: qrl dir repo payments',{dir:{repo:'~/work/{project}'}}),
      example('notes.yaml','Keep your important notes close.\nTry: nvim $(qrl notes ideas)',{notes:{ideas:'~/notes/ideas.md',daily:'~/notes/daily.md'}}),
      example('workspace.toml','Nest directories by purpose.',{work:{src:'~/work/app/src',tests:'~/work/app/tests'},personal:{projects:'~/projects'}}),
      example('ssh.yaml','Shortcut the files you keep editing.\nTry: nvim $(qrl config ssh)',{config:{ssh:'~/.ssh/config',git:'~/.gitconfig'}}),
      example('manifests.toml','Parameterize file paths too.\nTry: qrl file manifest staging',{file:{manifest:'~/platform/{env}/deployment.yaml'}}),
      example('relative.json','Relative paths start at your\ncurrent shell directory.',{local:{root:'./',readme:'./README.md',source:'./src'}}),
      example('kube.yaml','Pass a saved file path to another tool.\nTry: kubectl --kubeconfig "$(qrl file kube)" get pods',{file:{kube:'~/.kube/config'}}),
    ],
  },
  {
    id:'scripts', superstar: 'cluster.toml',label:'Scripts',title:'Bottle your best shell tricks.',
    caption:'Embed tricks and automations as small shell scripts in your configs. Bake them into your tool, bring it to work and share them with others.',
    examples:[
      example('journal.yaml','Prepend a timestamp, then edit the log.',script('note','log="$HOME/daily.log"\ntouch "$log"\nold=$(cat "$log")\nprintf "%s\\n%s\\n" "$(date -Iseconds)" "$old" > "$log"\nnvim "$log"')),
      example('checks.toml','One command for the pre-commit ritual.',script('check','set -e\ncargo fmt --check\ncargo clippy -- -D warnings\ncargo test')),
      example('reviews.yaml','Forward every argument to gh.\nTry: qrl pr --title "Ship it" --draft',script('pr','gh pr create "$@"')),
      example('cluster.toml','Name positional arguments for kubectl.\nTry: qrl pod payments staging api-123',script('pod','namespace="$1"\ncontext="$2"\npod="$3"\nkubectl -n "$namespace" --context "$context" exec -it "$pod" -- sh','bash')),
      example('dev.json','Start your local services together.',script('up','docker compose up -d')),
      example('logs.yaml','Follow whichever services you pass.\nTry: qrl logs api worker',script('logs','docker compose logs -f "$@"')),
      example('release.toml','Stop the chain if a check fails.',script('build','set -e\nnpm run lint\nnpm test\nnpm run build')),
      example('windows.yaml','Choose PowerShell and use $args.',script('hello','Write-Output "Hello, $($args[0])!"','pwsh')),
      example('docs.toml','Keep the docs preview command handy.',script('preview','uv run mkdocs serve')),
    ],
  },
  {
    id:'teams', superstar: 'services.yaml',label:'Teams',title:'Shared resources. Shared language.',
    caption:'Create a clean, stable CLI interface for your team’s key resources. Share a config so everyone can use the same names for the same things.',
    examples:[
      example('platform.toml','Give your team a shared tool name.',tool({links:{handbook:'https://kubernetes.io/docs',oncall:'https://www.pagerduty.com'}})),
      example('onboarding.yaml','A small starting point for new joiners.',tool({team:{guide:'https://handbook.gitlab.com',chat:'https://app.slack.com',board:'https://linear.app'}})),
      example('support.json','Share names for support docs and status.',tool({links:{help:'https://support.zendesk.com',status:'https://www.githubstatus.com'}})),
      example('services.yaml','Filter team logs by environment.\nTry: team logs prod payments',tool({logs:'https://app.datadoghq.com/logs?query=env%3A{env}%20service%3A{service}'})),
      example('runbooks.toml','Keep incident resources easy to find.',{incident:{runbook:'https://sre.google/workbook/incident-response',alerts:'https://app.datadoghq.com/monitors/manage',status:'https://www.githubstatus.com'}}),
      example('quality.yaml','Share the team’s validation routine.',tool(script('check','set -e\nnpm run lint\nnpm test'))),
      example('people.toml','Public handbook and time-off policy.\nUseful beyond engineering.',tool({docs:{handbook:'https://handbook.gitlab.com',leave:'https://handbook.gitlab.com/handbook/people-group/paid-time-off'}})),
      example('reviews.json','Keep a shared project’s review queue close.',{reviews:{team:'https://github.com/kubernetes/kubernetes/pulls'}}),
      example('service.yaml','Change a destination, keep its name.\nShare the updated file with your team.',tool({docs:'https://vuejs.org/guide/introduction.html',dashboard:'https://play.grafana.org'})),
    ],
  },
];
// Expand the featured configs into useful miniature toolkits.
const superstar = id => {
  const feature = FEATURES.find(feature => feature.id === id);
  return feature.examples.find(example => example.file === feature.superstar);
};
Object.assign(superstar('cli').config.prod, {
  scheduler: 'https://app.datadoghq.com/logs?query=service%3Ascheduler',
});
superstar('cli').config.staging = {
  api: 'https://app.datadoghq.com/logs?query=service%3Aapi%20env%3Astaging',
  worker: 'https://app.datadoghq.com/logs?query=service%3Aworker%20env%3Astaging',
};
Object.assign(superstar('urls').config.logs, {
  worker: 'https://app.datadoghq.com/logs?query=service%3Aworker%20env%3A{env}',
  errors: 'https://app.datadoghq.com/logs?query=status%3Aerror%20env%3A{env}',
  request: 'https://app.datadoghq.com/logs?query=env%3A{env}%20%40request_id%3A{id}',
});
Object.assign(superstar('paths').config.config, {
  git: '~/.gitconfig',
  ssh: '~/.ssh/config',
});
superstar('paths').config.dir = { nvim: '~/.config/nvim', projects: '~/work' };
Object.assign(superstar('scripts').config,
  script('pods', 'kubectl --namespace "$1" --context "$2" get pods', 'bash'),
  script('logs', 'kubectl --namespace "$1" --context "$2" logs -f "$3"', 'bash'),
);
Object.assign(superstar('teams').config, {
  docs: 'https://kubernetes.io/docs',
  reviews: 'https://github.com/kubernetes/kubernetes/pulls',
  alerts: 'https://app.datadoghq.com/monitors/manage',
});
// Notebook-style prompts describe existing QRL features, not a roadmap.
const DOODLES = {
  cli: ['Would be sick if keys turned into CLI commands.', 'What if this whole tool was just called logs?', 'TOML tables could be little command groups…', 'Same idea, but make it YAML?', 'JSON people should get to play too.', 'Forget a command? Maybe just pick from a menu.', 'One config, one tiny tool. Personal toolbox?', 'Links + folders + scripts, all in one file?', 'Edit. Save. Run again. No rebuild dance.'],
  urls: ['What if my bookmarks lived in git?', 'One place for all the dashboards I keep losing.', 'Oooh we could even support parameters in URLs.', 'A tiny reading list, straight from the terminal.', 'That one link I always open in Edge…', 'Could the host AND the repo be parameters?', 'Paste a request ID. Jump straight to its logs.', 'Not everything has to be work stuff :)', 'Missing a parameter? Just ask me for it.'],
  paths: ['Would love to teleport between project folders.', 'All those dotfiles… give them little names?', 'One repo shortcut, any project. Hmm.', 'My notes deserve shortcuts too.', 'Folders inside groups inside folders?', 'Where did I put that SSH config again?', 'Same file, different environment. Parameter?', 'Sometimes right here is the best starting point.', 'Could I pass a saved path into another command?'],
  scripts: ['Timestamp the journal, then drop me into nvim.', 'The whole pre-commit ritual in one command?', 'Forward all the args. No wrapper boilerplate.', 'kubectl commands are long. Bottle the useful bits?', 'Bring up the local stack. Go make coffee.', 'Follow logs for whichever services I name.', 'Chain the checks. Stop if anything fails.', 'PowerShell friends should get shortcuts too.', 'I can never remember the docs preview command.'],
  teams: ['What if everyone on the team had the same tool?', 'New joiner starter pack, but as a config.', 'Support links that nobody has to ask for.', 'Shared names for logs, docs, reviews, the lot?', 'An incident toolbox. Less searching at 3am.', 'One shared command for our quality checks.', 'Maybe this is useful outside engineering too?', 'That review queue should be one command away.', 'Change the link. Keep the name. Nobody relearns it.'],
};
for (const feature of FEATURES) {
  feature.examples.forEach((item, index) => {
    const invocation = item.note.split('\n').filter(line => line.startsWith('Try:'));
    item.note = [DOODLES[feature.id][index], ...invocation].join('\n');
  });
  feature.sideExamples = feature.examples.filter(item => item.file !== feature.superstar).slice(0, 6).map(item => {
    const [stem, format] = item.file.split('.');
    const alternate = { toml: 'yaml', yaml: 'json', json: 'toml' }[format];
    return example(`${stem}-alt.${alternate}`, `Same little idea in ${alternate.toUpperCase()}?\n${item.note}`, item.config);
  });
}

// User-authored brainstorm copy, displayed literally rather than serialized.
const pitchTopic = FEATURES.find(feature => feature.id === "cli");
Object.assign(pitchTopic.examples[0], {"file": "could-be-cool.toml", "note": "", "source": "# Pitch: config --> cli tool kit\n# 1. Use config files to track key stuff in git\n# 2. Run <something?> to turn keys and values into small cli tools\n# 3. Auto updates and i only need to change config files for new behavior\n\n# Like lets say we just type \"docs cliguide\" or \"docs wiki teams\"\n# and it just opens in browser by mapping keys to urls\n\n[docs]\ncliguide = \"https://notion.so/CLI-guide-8e16b3a947c24f20a1d098c63b52ef74\"\nref = \"https://notion.so/Reference-2c97d5e813a64b09b4f160d82e7a395c\"\nteams = \"https://notion.so/Teams-6a30c8f129d74e52a9b4061d83e7fc25\"\n\n# but we ALSO add dirs or files and just jump there when called\nnotes = \"~/home/notes\"\ndesk = \"~/Desktop\"\ndev = \"~/dev\"\n\n# Uh or even put small tricks / scrips in there like \"notes todo\"\n[notes.todo]\n$run = \"\"\"\npath = ~/home/notes/todo.md\nsed -i \"1i# $(date '+%Y-%m-%d %H:%M:%S')\" $path\nnvim $path\n\"\"\"\n"});
Object.assign(pitchTopic.examples[1], {"file": "nesting.toml", "note": "", "source": "# Actually for logs having nesting would be very very use full\n# So for like \"logs backend prod nginx\" we would use keys like so:\n\n[logs]\n[logs.backend.prod]\n'api-server' = \"https://logs.internal/app/discover#/view/a7f3c920\"\n'nginx' = \"https://logs.internal/app/discover#/view/9d21b6e4\" # \n'cache' = \"https://logs.internal/app/discover#/view/c840f17a\"\n'db' = \"https://logs.internal/app/discover#/view/62be09d3\"\n'cdn' = \"https://dash.cloudflare.com/8f3a91c2d7e640b5a02c6e914db873fa/analytics\"\n\n[logs.backend.staging]\n'api-server' = \"https://logs.internal/app/discover#/view/f19a4c72\"\n'nginx' = \"https://logs.internal/app/discover#/view/30d8e5b1\"\n'cache' = \"https://logs.internal/app/discover#/view/b67c02f9\"\n\n# And we can even store misc random queries\n\n[logs.misc.live]\nhttp500s = \"https://logs.internal/app/discover#/view/e2409a6d\"\nhttps404 = \"https://logs.internal/app/discover#/view/7cb18f03\"\nexceptions = \"https://logs.internal/app/discover#/view/4a96d2e8\"\nfailed-signups = \"https://logs.internal/app/discover#/view/d5037bc1\"\n"});
Object.assign(pitchTopic.examples[0], {"file": "could-be-cool.toml", "note": "", "source": "# <+> main idea <+>\n# qrlkit turns file --> cli tool\n# 1. Use config files to track booksmarks, snippets, shortcuts\n# 2. Run qrlkit to turn keys and values in files into small cli tools\n# 3. Only change config files for new behavior (auto updates)\n\n# Imagine we just type \"docs cli\" or \"docs wiki teams\" in \n# terminal and it opens in browser by mapping keys to urls\n\n[docs]\ncli = \"https://notion.so/CLI-guide-8e16b3a947c24f20a1d098c63b52ef74\"\nref = \"https://notion.so/Reference-2c97d5e813a64b09b4f160d82e7a395c\"\n\n[docs.wiki]\nteams = \"https://notion.so/Teams-6a30c8f129d74e52a9b4061d83e7fc25\"\ndesign-guide = \"https://notion.so/Teams-947c24f20a1d094061d834061d83e733\"\n\n# but we ALSO add dirs or files and just jump there when called\nnotes = \"~/home/notes\"\ndesk = \"~/Desktop\"\ndev = \"~/dev\"\n\n# Uh or even put small tricks / scrips in there like \"notes todo\"\n[notes.todo]\n$run = \"\"\"\npath = ~/home/notes/todo.md\nsed -i \"1i# $(date '+%Y-%m-%d %H:%M:%S')\" $path\nnvim $path\n\"\"\"\n"});
Object.assign(pitchTopic.examples[1], {"source": "# Actually for logs having nesting would be very very use full\n# So for like \"logs backend prod nginx\" we would use keys like so:\n\n[logs]\n[logs.backend.prod]\n'api-server' = \"https://logs.internal/app/discover#/view/a7f3c920\"\n'nginx' = \"https://logs.internal/app/discover#/view/9d21b6e4\" # \n'cache' = \"https://logs.internal/app/discover#/view/c840f17a\"\n'db' = \"https://logs.internal/app/discover#/view/62be09d3\"\n'cdn' = \"https://dash.cloudflare.com/8f3a91c2d7e640b5a02c6e914db873fa/analytics\"\n\n[logs.backend.staging]\n'api-server' = \"https://logs.internal/app/discover#/view/f19a4c72\"\n'nginx' = \"https://logs.internal/app/discover#/view/30d8e5b1\"\n'cache' = \"https://logs.internal/app/discover#/view/b67c02f9\"\n\n# And we can even store misc random queries\n[logs.misc.live]\nhttp500s = \"https://logs.internal/app/discover#/view/e2409a6d\"\nhttps404 = \"https://logs.internal/app/discover#/view/7cb18f03\"\nexceptions = \"https://logs.internal/app/discover#/view/4a96d2e8\"\nfailed-signups = \"https://logs.internal/app/discover#/view/d5037bc1\"\n\n# and just run \"logs misc live failed-signups\" to quickly find logs\n"});
pitchTopic.examples.push({ file: 'qrlkit-basics.toml', note: '', source: '# See installed QRLs\n$ qrlkit\n\n# Browse or open a resource\n$ qrlkit [keys...]\n\n# Add a QRLs file (toml, yaml, json should be supported)\n$ qrlkit add <path>\n\n# List registered config files\n$ qrlkit ls\n\n# Unregister a config, but keep the file\n$ qrlkit rm <path>\n\n# Refresh imports and retry directory setup\n$ qrlkit reload\n\n# Choose a browser\n$ qrlkit set-browser\n\n# Print shell integration for manual setup\n$ qrlkit init <shell>\n\n# Reset imports, renames, and browser selection\n$ qrlkit nuke\n\n# Show help\n$ qrlkit --help\n' });
pitchTopic.examples.push({ file: 'using-inputs.toml', note: '', source: "# Providing inputs to tools could be gold..\n# syntax should enable variables in {} that users can provide..\n\n[stats]\nplatform = \"https://{subdomain}.stats.platform/{service}\"\n\n[search]\ngoogle = \"https://google.com?q={input}\"\nchatgpt = \"https://chatgpt.com/?q={input}\"\n\n# Same in dirs and file paths\n[helm]\nrelease = \"~/dev/scaleapp/helm/{package}/release.yaml\"\n\n[config]\ndotfiles = \"~/.config/{tool}\"\n\n# Scripts should support normal shell syntax with $1 $2 $3 etc\n[scripts]\n[scripts.release]\n\"$run\" = \"\"\"\nhelm upgrade --install scaleapp ~/dev/scaleapp/helm/$1/release.yaml\n\"\"\"\n\n# And $@ to parse complete list of args user gave\n[scripts.pr]\n\"$run\" = 'gh pr create \"$@\"'\n" });
pitchTopic.examples.push({
  file: 'customize.toml',
  note: '',
  source: "# User should be able customize behavior\n\n# Files by default just print the path stored\n# We should allow a filehook that does something else with a script\n[dotfiles]\nnvim = '~/.config/nvim/init.lua'\ntmux = '~/.config/tmux/.tmux.config'\n\"$filehook\" = \"nvim file\"\n\n# Same kind of things for dirs. By default we cd into them\n# but user should be able to do more like:\n[repo]\nblog = \"~/blog\"\nnotes = \"~/notes\"\n\"$dirhook\" = \"cd dir && tree -L 1 .\"\n\n# Links are opens in the browser choosen at qrlkit init\n# Sometimes certain pages only run on som browsers\n# so user should be able to do something like\n\n[webtools]\ntimereg = \"https://hr.internal.org/app\"\n\"$browser\" = \"Chrome\"\n\n# Each of these should be local overwrites to\n# global default values set by user with\nqrlkit set-filehook \"nvim file\"\nqrlkit set-dirhook \"cd dir && tree -L 1\"\nqrlkit set-browser \"Chrome\"\n",
});
pitchTopic.superstar = "could-be-cool.toml";
