const ayaPlayer = new Audio()
const suraPlayer = new Audio()

const QuranApp = {
    data() {
        return {
            SuraInfo: [],
            SuraText: [],

            CurrentSuraId: 1,
            CurrentSuraText: [],
            AyatStatus: [],
            ShowAyat: true,

            UserText: [],
            IsPlayingSura: false,
            CurrentPlayingAya: 0
        }
    },
    mounted() {
        this.SuraInfo = QuranSura
        this.SuraText = QuranText

        this.SuraChanged()
    },
    methods: {
        SuraChanged: function() {
            // stop audio
            this.ResetAudioPlayers()

            // show ayat
            this.CurrentSuraText = this.SuraText.filter(s => s.sura == this.CurrentSuraId)

            this.AyatStatus = new Array(this.CurrentSuraText.length)
            this.AyatStatus.fill(false)

            this.UserText = new Array(this.CurrentSuraText.length)
            this.UserText.fill('')
        },

        ToggleAyat: function() {
            this.ShowAyat = ! this.ShowAyat
        },

        HandleTypeing: function(ayaId, evt) {
            if (["Tab", "Enter", "unidentified"].includes(evt.key)) {
                return false;
            }

            if (["Backspace", "Delete"].includes(evt.key)) {
                this.AyatStatus[ayaId-1] = false;
                return false;
            }

            // other keys, and valid
            if (this.AyatStatus[ayaId-1]) {
                evt.preventDefault()
                return true;
            }

            // compare aya text with user input
            this.AyatStatus[ayaId-1] = this.UserText[ayaId - 1] + evt.key === this.CurrentSuraText[ayaId - 1].text
            
            const userAyaText = this.UserText[ayaId - 1].toString() + evt.key

            var cond = !this.CurrentSuraText[ayaId - 1].text.startsWith(userAyaText)
            if (cond) {
                evt.preventDefault()
                return false;
            }

            return true;
        },
        PlayAya: function(ayaId) {
            const ayaNum = this.CurrentSuraId.toString().padStart(3, '0') + ayaId.toString().padStart(3, '0')
            
            // play audio
            const ayaURL = 'https://verse.mp3quran.net/arabic/maher_almuaiqly/64/' + ayaNum + '.mp3'
            suraPlayer.pause()
            ayaPlayer.pause()
            ayaPlayer.src = ayaURL
            ayaPlayer.play()
        },
        ListenToSurah: function() {
            // stop
            if (this.IsPlayingSura) {
                this.ResetAudioPlayers()
                return;
            }

            this.IsPlayingSura = true
            ayaPlayer.pause()

            // run basmalah
            this.PlayBasmalahOnSuraPlayer()

            this.CurrentPlayingAya = 0

            suraPlayer.onended = this.PlayNextAyaOnSuraPlayer
        },

        PlayNextAyaOnSuraPlayer: function() {
            this.CurrentPlayingAya += 1
            
            if (this.CurrentPlayingAya > this.CurrentSuraText.length) {
                this.IsPlayingSura = false
                return
            }

            this.PlayAyaOnSuraPlayer(this.CurrentPlayingAya)
        },

        PlayAyaOnSuraPlayer: function(ayaId) {
            const ayaNum = this.CurrentSuraId.toString().padStart(3, '0') + ayaId.toString().padStart(3, '0')

            const ayaURL = 'https://verse.mp3quran.net/arabic/maher_almuaiqly/64/' + ayaNum + '.mp3'
            suraPlayer.src = ayaURL;
            suraPlayer.play()
        },

        PlayBasmalahOnSuraPlayer: function() {
            this.PlayAyaOnSuraPlayer(0)
        },

        ResetAudioPlayers: function() {
            this.IsPlayingSura = false;
            this.CurrentPlayingAya = 0

            suraPlayer.pause()
            ayaPlayer.pause()
        }
    }
}

Vue.createApp(QuranApp).mount('#QuranApp')


function setEndOfContenteditable(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}