const {
	default: makeWASocket,
	useSingleFileAuthState,
	DisconnectReason,
	getContentType ,
	jidDecode
} = require('@adiwajshing/baileys')


const config = require('./config');
const ffmpeg = require('fluent-ffmpeg');
const {execFile} = require('child_process');
const cwebp = require('cwebp-bin');
const { exec } = require('child_process')
const { sms } = require('./lib/message');
const { imageToWebp, videoToWebp, writeExif } = require('./lib/stic')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep } = require('./lib/functions')
const fs = require('fs');
const ownerNumber = ['94701629707']
const prefix = '.'
const axios = require('axios');
const { yt720 ,  yt480 ,  yt360 } = require('./lib/ytmp4');
const ytmp3 = require('./lib/ytmp3');
const apk_link = require('./lib/playstore');
const yts = require( 'yt-search' )


async function ytinfo(name) {

         let arama = await yts(name);
        arama = arama.all;
        if(arama.length < 1) { 
        let result = { status : false} 
        return result 
         } 
        else {
        let thumbnail = arama[0].thumbnail;
        let title = arama[0].title.replace(/ /gi, '+');
        let title2 = arama[0].title
        let views = arama[0].views;
        let author = arama[0].author.name;
        let url = arama[0].url
        let result = { msg : 'âââ[ð¥B O R I M O - BOTâ]âââ\nâ   *ð¥YT DOWNLOADER ØªØ­ÙÙÙ Ø§ÙÙÙØ¯ÙÙØ§Øª ÙÙ Ø§ÙÙÙØªÙØ¨ð¤*  â£\nâââââââââââââââ\n\nâð½ï¸Ø§ÙØ¹ÙÙØ§Ù: ' + title2 + '\n\nâðï¸Ø§ÙÙØ´Ø§ÙØ¯Ø§Øª: ' + views + '\n\nâð¹ Ø§ÙÙÙØ§Ø©: ' + author + '\n\nâðï¸Ø§ÙØ±Ø§Ø¨Ø·: ' + url + '\n\nâââââââââââââ' , 
                      thumbnail : thumbnail ,
                      yuturl: url }
        return result
 
        }
}


async function cmd(conn , mek ) {

try {
  
mek = mek.messages[0]
			if (!mek.message) return
			
			mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
			if (mek.key && mek.key.remoteJid === 'status@broadcast') return
			if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
			const type = getContentType(mek.message)
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			
			const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
			const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : ( type == 'listResponseMessage') && mek.message.listResponseMessage.singleSelectReply.selectedRowId? mek.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'buttonsResponseMessage') && mek.message.buttonsResponseMessage.selectedButtonId  ? mek.message.buttonsResponseMessage.selectedButtonId  : (type == "templateButtonReplyMessage") && mek.message.templateButtonReplyMessage.selectedId ? mek.message.templateButtonReplyMessage.selectedId  :  (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
			
			const isCmd = body.startsWith(prefix)
			const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
			
			const args = body.trim().split(/ +/).slice(1)
			const q = args.join(' ')
			const isGroup = from.endsWith('@g.us')
			const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
			const senderNumber = sender.split('@')[0]
			const botNumber = conn.user.id.split(':')[0]
			const pushname = mek.pushName || 'unknown'
			
			const isMe = botNumber.includes(senderNumber)
			const isOwner = ownerNumber.includes(senderNumber) || isMe
      
      
      switch (command) {
      
		    // alive //  
		      
      case 'alive':
         try {
		await conn.sendMessage(from , { audio : fs.readFileSync("./src/alive.mpeg") , mimetype : 'audio/mpeg' , ptt: true  } , { quoted: mek })
              var alivemsg = ''
              if (config.ALIVEMSG == 'default') alivemsg = '```ð Hi! I am online now. ÙØ±Ø­Ø¨Ø§ Ø£ÙØ§ ÙØªØµÙ Ø§ÙØ§Ù ÙÙ Ø®Ø¯ÙØªÙ ð```'
              if ( config.ALIVEMSG !== 'default') alivemsg = config.ALIVEMSG
              const templateButtons = [
              { urlButton: {displayText: config.URL_1NAME , url: config.URL_1LINK }},
              { urlButton: {displayText: config.URL_2NAME , url: config.URL_2LINK }},
              { quickReplyButton: {displayText: 'MENU', id: prefix +'menu' }} , 
              { quickReplyButton: {displayText: 'OWNER', id: prefix +'owner' }}   
                                      ]
               const buttonMessage = {
               caption: alivemsg ,
               footer: config.FOOTER,
               templateButtons: templateButtons,
               image: {url: config.ALIVE_LOGO}
                                      }                             
                 await conn.sendMessage(from, buttonMessage )
         } catch(e) { 
                      return 
         } 
        break
		      
		      
 //_______________________________________________________________________________________________________________________________________________________   //      
		    // sticker //  
		      
		      
        case 'sticker' :
        case 's' :
        case 'stic' :
          const v = sms(conn , mek)
          const isQuotedViewOnce = v.quoted ? (v.quoted.type === 'viewOnceMessage') : false
	        const isQuotedImage = v.quoted ? ((v.quoted.type === 'imageMessage') || (isQuotedViewOnce ? (v.quoted.msg.type === 'imageMessage') : false)) : false
	        const isQuotedVideo = v.quoted ? ((v.quoted.type === 'videoMessage') || (isQuotedViewOnce ? (v.quoted.msg.type === 'videoMessage') : false)) : false
          if ((v.type === 'imageMessage') || isQuotedImage) { 
          const cstic = await conn.sendMessage(from , { text: 'creating Ø¬Ø§Ø±Ù ØµÙØ§Ø¹Ø© Ø§ÙÙÙØµÙ' }, { quoted: mek } )
          var nameJpg = getRandom('')
	        isQuotedImage ? await v.quoted.download(nameJpg) : await v.download(nameJpg)
	        var stik = await imageToWebp(nameJpg + '.jpg')
	        writeExif(stik, {packname: config.STIC_WM, author: ''})
		      .then(x => v.replyS(x))
          await conn.sendMessage(from, { delete: cstic.key })
          }else if ((v.type === 'videoMessage') || isQuotedVideo) {
	       const cstic = await conn.sendMessage(from , { text: 'creating' }, { quoted: mek } )  
	       var nameMp4 = getRandom('')
	       isQuotedVideo ? await v.quoted.download(nameMp4) : await v.download(nameMp4)
         writeExif(stik, {packname: config.STIC_WM , author: ''})
		     .then(x => v.replyS(x))
         await conn.sendMessage(from, { delete: cstic.key })
         } else {
	       v.reply('Ø£ÙÙ ÙÙ Ø§ÙØµÙØ±Ø© Ø§Ù Ø§ÙÙÙØ¯ÙÙ Ø§ÙØ°Ù ØªÙØ¯ Ø§Ù ØªØ­ÙÙÙ ÙÙÙÙØµÙ ÙØ§ Ø¹Ø²ÙØ²Ù')
        }
              break 
   // _ _ _ _ _ _ _ _ __  _ _ _ _ _ _  __  _ _ _ __ _  __ _  _ _ _ _ __ _ _  __  __ _  _ __  _ __ _ _ _  _ __ _  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __  __ _  __ _ _ _ _   //      
	      case 'sticget' :
              case 'stickget' :
              case 'take'  :
              case 'wm':
		      try {
	      if(!q) return await conn.sendMessage(from , { text: 'enter packname and creater name\n ex : '  + prefix + 'sticget bobiz sticker;multi device' }, { quoted: mek } )
		var packname = '' 
		var creater = '' 
		if (q.includes(';')) {
           var split = q.split(';');
           packname = split[0];
	   creater =  split[1]
		} else {
	   packname  = q ;		
           creater =  '' ;
           }
              const v = sms(conn , mek)
	        const isQuotedViewOnce = v.quoted ? (v.quoted.type === 'viewOnceMessage') : false
	        const isQuotedImage = v.quoted ? ((v.quoted.type === 'imageMessage') || (isQuotedViewOnce ? (v.quoted.msg.type === 'imageMessage') : false)) : false
	        const isQuotedVideo = v.quoted ? ((v.quoted.type === 'videoMessage') || (isQuotedViewOnce ? (v.quoted.msg.type === 'videoMessage') : false)) : false
            
		const isQuotedSticker = v.quoted ? (v.quoted.type === 'stickerMessage') : false
          if ((v.type === 'imageMessage') || isQuotedImage) { 
          const cstic = await conn.sendMessage(from , { text: 'creating' }, { quoted: mek } )
          var nameJpg = getRandom('')
	        isQuotedImage ? await v.quoted.download(nameJpg) : await v.download(nameJpg)
	        var stik = await imageToWebp(nameJpg + '.jpg')
	        writeExif(stik, {packname: packname, author: creater})
		      .then(x => v.replyS(x))
          await conn.sendMessage(from, { delete: cstic.key })
          }else if ((v.type === 'videoMessage') || isQuotedVideo) {
	       const cstic = await conn.sendMessage(from , { text: 'creating' }, { quoted: mek } )  
	       var nameMp4 = getRandom('')
	       isQuotedVideo ? await v.quoted.download(nameMp4) : await v.download(nameMp4)
         writeExif(stik, {packname: packname , author: creater })
		     .then(x => v.replyS(x))
         await conn.sendMessage(from, { delete: cstic.key })
         }  else if ( isQuotedSticker ) { 
          const cstic = await conn.sendMessage(from , { text: 'creating' }, { quoted: mek } )
          var nameWebp = getRandom('')
          await v.quoted.download(nameWebp)
	        writeExif(nameWebp + '.webp', {packname: packname, author: creater })
		      .then(x => v.replyS(x))
          await conn.sendMessage(from, { delete: cstic.key })
          }else {
	       v.reply('reply to sticker , image or video')
        } } catch(e) {
	return
	
	}
              break
		      
		      
 //_______________________________________________________________________________________________________________________________________________________   //		      
		     // mediafire //
		      
	      case "mediafire" :
	      case "mfire" : 
		try {
		if (!q) return await conn.sendMessage(from , { text: 'Ø£ÙÙ ÙÙ Ø±Ø§Ø¨Ø· Ø§ÙÙÙØ¯ÙØ§ÙØ§ÙØ± Ø§ÙØ¯Ù ØªÙØ¯ ØªØ­ÙÙÙÙ ÙØ§ Ø¹Ø²ÙØ²Ù' }, { quoted: mek } )
		if (!q.includes('mediafire.com/file')) return await conn.sendMessage(from , { text: 'need mediafire link' }, { quoted: mek } )
		const data = await axios.get('https://bobiz-api.herokuapp.com/api/mfire?url=' + q)
		const file = data.data
  if ( file.filesize > 150000) return await conn.sendMessage(from , { text: mx }, { quoted: mek } )
  const fileup = await conn.sendMessage(from , { text: config.FILE_DOWN }, { quoted: mek } )
  await conn.sendMessage(from, { delete: fileup.key })
  const filedown = await conn.sendMessage(from , { text: config.FILE_UP }, { quoted: mek } )
  const doc = await conn.sendMessage(from , { document : { url : file.url  } , mimetype : file.ext , fileName : file.filename } , { quoted: mek })
  await conn.sendMessage(from, { delete: filedown.key })	
		} 
		catch(e) {
			await conn.sendMessage(from , { text: 'ØªØ¹Ø°Ø± ØªØ­ÙÙÙ Ø§ÙÙÙÙ Ø¢Ø³Ù ØµØ¯ÙÙÙ\n\n' + e }, { quoted: mek } )
		}
		      
	      break
		      
		      
 //_______________________________________________________________________________________________________________________________________________________   //		      
		      // instagram //
		      
	      case "ig" :
	      case "instagram" :
              case "insta":
		try {
		if (!q) return await conn.sendMessage(from , { text: 'Ø£ÙÙ ÙÙ Ø±Ø§Ø¨Ø· ÙÙØ¯ÙÙ Ø§ÙØ³ØªØºØ±Ø§Ù Ø§ÙØ¯Ù ØªÙØ¯ ØªØ­ÙÙÙÙ Ø¹Ø²ÙØ²Ù ' }, { quoted: mek } )
		if (!q.includes('instagram.com')) return await conn.sendMessage(from , { text: 'need instagram link' }, { quoted: mek } )
		const data = await axios.get('https://bobiz-api.herokuapp.com/api/ig?url=' + q)
		const file = data.data[0]

  const fileup = await conn.sendMessage(from , { text: config.VIDEO_DOWN }, { quoted: mek } )
  await conn.sendMessage(from, { delete: fileup.key })
  const filedown = await conn.sendMessage(from , { text: config.VIDEO_UP }, { quoted: mek } )
  const doc = await conn.sendMessage(from , { video : { url : file.downloadUrl  } ,  caption : config.CAPTION } , { quoted: mek })
  await conn.sendMessage(from, { delete: filedown.key })	
		} 
		catch(e) {
			await conn.sendMessage(from , { text: 'error\n\n' + e }, { quoted: mek } )
		}
		      
	      break   
		      
//_______________________________________________________________________________________________________________________________________________________   //	      
		      // tiktok //
		      
	      case "tik" :
	      case "tiktok" : 
		try {
		if (!q) return await conn.sendMessage(from , { text: 'need tiktok link' }, { quoted: mek } )
		if (!q.includes('tiktok')) return await conn.sendMessage(from , { text: 'need tiktok link' }, { quoted: mek } )
		const data = await axios.get('https://bobiz-api.herokuapp.com/api/tiktok?url=' + q)
		const file = data.data

  const fileup = await conn.sendMessage(from , { text: config.VIDEO_DOWN }, { quoted: mek } )
  await conn.sendMessage(from, { delete: fileup.key })
  const filedown = await conn.sendMessage(from , { text: config.VIDEO_UP }, { quoted: mek } )
  const doc = await conn.sendMessage(from , { video : { url : file.no_watermark  } ,  caption : config.CAPTION } , { quoted: mek })
  await conn.sendMessage(from, { delete: filedown.key })	
		} 
		catch(e) {
			await conn.sendMessage(from , { text: 'error\n\n' + e }, { quoted: mek } )
		}
		      
	      break
		      
 //_______________________________________________________________________________________________________________________________________________________   //		      
		      // facebook //
		      
	      case 'fb' :
	      case 'facebook' :
	      try {
	     if (!q) return await conn.sendMessage(from , { text: 'need fb link  Ø§ÙÙ ÙÙ Ø±Ø§Ø¨Ø· ÙÙØ¯ÙÙ Ø§ÙÙÙØ³Ø¨ÙÙ Ø§ÙØ°Ù ØªØ±ÙØ¯ ØªØ­ÙÙÙÙ' }, { quoted: mek } )      
	     const isfb = q.includes('facebook.com')? q.includes('facebook.com') : q.includes('fb.watch')? q.includes('fb.watch') : ''
             if (!isfb) return await conn.sendMessage(from , { text: 'need fb link' }, { quoted: mek } )  
		const msg = 'âââ[ð¥B O R I M O - BOTâ]âââ\nâ   *ð¥FB DOWNLOADERð¤*  â£\nâââââââââââââââ\n\nâ Ø§Ø®ØªØ± Ø§ÙØ¬ÙØ¯Ø© Ø§ÙØªÙ ØªØ±ÙØ¯ÙØ§ \n\nâââââââââââââââ'
      const buttons = [
{buttonId: prefix +'sdfb ' + q, buttonText: {displayText: 'SD '}, type: 1},
{buttonId: prefix +'hdfb ' + q, buttonText: {displayText: 'HD '}, type: 1},
]
 await conn.sendMessage(from, {  text: msg , footer: config.FOOTER , buttons: buttons , headerType: 4} , { quoted: mek } )  
		      
	      } catch(e) {
		await conn.sendMessage(from , { text: 'error\n\n' + e }, { quoted: mek } )      
	      }      
	      break
		      
  // _ _ _ _ _ _ _ _ __  _ _ _ _ _ _  __  _ _ _ __ _  __ _  _ _ _ _ __ _ _  __  __ _  _ __  _ __ _ _ _  _ __ _  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __  __ _  __ _ _ _ _   //   		      
	      
	      case 'hdfb' : 
		      try {
		if (!q) return await conn.sendMessage(from , { text: 'need fb link' }, { quoted: mek } )
		const data = await axios.get('https://bobiz-api.herokuapp.com/api/fb?url=' + q)
		const file = data.data[0]

  const fileup = await conn.sendMessage(from , { text: config.VIDEO_DOWN }, { quoted: mek } )
  await conn.sendMessage(from, { delete: fileup.key })
  const filedown = await conn.sendMessage(from , { text: config.VIDEO_UP }, { quoted: mek } )
  const doc = await conn.sendMessage(from , { video : { url : file.url  } ,  caption : config.CAPTION } , { quoted: mek })
  await conn.sendMessage(from, { delete: filedown.key })	
		} 
		catch(e) {
			await conn.sendMessage(from , { text: 'error\n\n' + e }, { quoted: mek } )
		}
		      break
		      
  // _ _ _ _ _ _ _ _ __  _ _ _ _ _ _  __  _ _ _ __ _  __ _  _ _ _ _ __ _ _  __  __ _  _ __  _ __ _ _ _  _ __ _  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __  __ _  __ _ _ _ _   //   
		      
		        case 'sdfb' : 
		      try {
		if (!q) return await conn.sendMessage(from , { text: 'need fb link' }, { quoted: mek } )
		const data = await axios.get('https://bobiz-api.herokuapp.com/api/fb?url=' + q)
		const file = data.data[1]

  const fileup = await conn.sendMessage(from , { text: config.VIDEO_DOWN }, { quoted: mek } )
  await conn.sendMessage(from, { delete: fileup.key })
  const filedown = await conn.sendMessage(from , { text: config.VIDEO_UP }, { quoted: mek } )
  const doc = await conn.sendMessage(from , { video : { url : file.url  } ,  caption : config.CAPTION } , { quoted: mek })
  await conn.sendMessage(from, { delete: filedown.key })	
		} 
		catch(e) {
			await conn.sendMessage(from , { text: 'error\n\n' + e }, { quoted: mek } )
		}
		      break
 //_______________________________________________________________________________________________________________________________________________________   //		      
		      
		      // youtube //
		      
	        case 'yt' :
		case 'ytd' :
		case 'song' :
		case 'video' : 
		   try {
			if (!q) return await conn.sendMessage(from , { text: 'need title' }, { quoted: mek } )   
			const ytl = await ytinfo(q)
			const buttons = [
{buttonId: prefix +'ytmp3 ' + ytl.yuturl, buttonText: {displayText: 'MP3'}, type: 1},
{buttonId: prefix +'ytmp4 ' + ytl.yuturl, buttonText: {displayText: 'MP4'}, type: 1},
]
			await conn.sendMessage(from, { image: {url: ytl.thumbnail  }, caption: ytl.msg , footer: config.FOOTER , buttons: buttons , headerType: 4} , { quoted: mek } )	
			   
		   } 
		      catch(e) {
		      await conn.sendMessage(from , { text: 'error\n\n' + e }, { quoted: mek } )
		      }
		break 
		      
  // _ _ _ _ _ _ _ _ __  _ _ _ _ _ _  __  _ _ _ __ _  __ _  _ _ _ _ __ _ _  __  __ _  _ __  _ __ _ _ _  _ __ _  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __  __ _  __ _ _ _ _   //   		 
		      
		 case 'ytmp3' :
	      try {
	     if (!q) return await conn.sendMessage(from , { text: 'need yt link' }, { quoted: mek } )      
	     
             if ( !q.includes('youtu') ) return await conn.sendMessage(from , { text: 'need yt link' }, { quoted: mek } )  
		const msg = 'âââ[ð¥B O R I M O - BOTâ]âââ\nâ    ð¥YOUTUBE MP3 DLð¤ â\nâââââââââââââââ\n\nâ select mp3 type \n\nâââââââââââââââ'
      const buttons = [
{buttonId: prefix +'ausong ' + q, buttonText: {displayText: 'AUDIO'}, type: 1},
{buttonId: prefix +'dcsong ' + q, buttonText: {displayText: 'DOCUMENT '}, type: 1},
]
 await conn.sendMessage(from, {  text: msg , footer: config.FOOTER , buttons: buttons , headerType: 4} , { quoted: mek } )  
		      
	      } catch(e) {
		await conn.sendMessage(from , { text: 'error' }, { quoted: mek } )      
	      }      
	      break  
		      
  // _ _ _ _ _ _ _ _ __  _ _ _ _ _ _  __  _ _ _ __ _  __ _  _ _ _ _ __ _ _  __  __ _  _ __  _ __ _ _ _  _ __ _  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __  __ _  __ _ _ _ _   //   		      
		      
	      case 'ytmp4' :
	      try {
	     if (!q) return await conn.sendMessage(from , { text: 'need yt link' }, { quoted: mek } )      
	     
             if ( !q.includes('youtu') ) return await conn.sendMessage(from , { text: 'need yt link' }, { quoted: mek } )  
		const msg = 'âââ[ð¥B O R I M O - BOTâ]âââ\nâ    ð¥YOUTUBE MP4 DLð¤ â\nâââââââââââââââ\n\nâ select video quality\n\nâââââââââââââââ'
      const buttons = [
{buttonId: prefix +'720vid ' + q, buttonText: {displayText: '720P'}, type: 1},
{buttonId: prefix +'480vid ' + q, buttonText: {displayText: '480P '}, type: 1},
]
 await conn.sendMessage(from, {  text: msg , footer: config.FOOTER , buttons: buttons , headerType: 4} , { quoted: mek } )  
		      
	      } catch(e) {
		await conn.sendMessage(from , { text: 'error' }, { quoted: mek } )      
	      }      
	      break 
		      
  // _ _ _ _ _ _ _ _ __  _ _ _ _ _ _  __  _ _ _ __ _  __ _  _ _ _ _ __ _ _  __  __ _  _ __  _ __ _ _ _  _ __ _  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __  __ _  __ _ _ _ _   //   		      
		      
		 case 'dcsong' :
	      try {
	     if (!q) return await conn.sendMessage(from , { text: 'need yt link' }, { quoted: mek } )      
	     
             if ( !q.includes('youtu') ) return await conn.sendMessage(from , { text: 'need yt link' }, { quoted: mek } )  
		 let docsong = await ytmp3(q)
            const docsongdown = await conn.sendMessage(from , { text: config.SONG_DOWN }, { quoted: mek } )
            await conn.sendMessage(from, { delete: docsongdown.key })
            const docsongup = await conn.sendMessage(from , { text: config.SONG_UP }, { quoted: mek } )
            const doc = await conn.sendMessage(from , { document : { url : docsong.mp3  } , mimetype : 'audio/mpeg' , fileName : docsong.title + '.mp3' } , { quoted: mek })
      
            await conn.sendMessage(from, { delete: docsongup.key })
    
		      
	      } catch(e) {
		await conn.sendMessage(from , { text: 'error' }, { quoted: mek } )      
	      }      
	      break  
		      
  // _ _ _ _ _ _ _ _ __  _ _ _ _ _ _  __  _ _ _ __ _  __ _  _ _ _ _ __ _ _  __  __ _  _ __  _ __ _ _ _  _ __ _  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __  __ _  __ _ _ _ _   //   		      
		      
			 case 'ausong' :
	      try {
	     if (!q) return await conn.sendMessage(from , { text: 'need yt link' }, { quoted: mek } )      
	     
             if ( !q.includes('youtu') ) return await conn.sendMessage(from , { text: 'need yt link' }, { quoted: mek } )  
	    let docsong = await ytmp3(q)
            const docsongdown = await conn.sendMessage(from , { text: config.SONG_DOWN }, { quoted: mek } )
            await conn.sendMessage(from, { delete: docsongdown.key })
            const docsongup = await conn.sendMessage(from , { text: config.SONG_UP }, { quoted: mek } )
            await conn.sendMessage(from ,{ audio: { url: docsong.mp3 }, mimetype: 'audio/mp4' } , { quoted: mek })
            await conn.sendMessage(from, { delete: docsongup.key })
    
		      
	      } catch(e) {
		await conn.sendMessage(from , { text: 'error' }, { quoted: mek } )      
	      }      
	      break   
		      
		      
  // _ _ _ _ _ _ _ _ __  _ _ _ _ _ _  __  _ _ _ __ _  __ _  _ _ _ _ __ _ _  __  __ _  _ __  _ __ _ _ _  _ __ _  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __  __ _  __ _ _ _ _   //   		      
		      
		 case '720vid' :
	      try {
	     if (!q) return await conn.sendMessage(from , { text: 'need yt link' }, { quoted: mek } )      
	     
             if ( !q.includes('youtu') ) return await conn.sendMessage(from , { text: 'need yt link' }, { quoted: mek } )  
	   let docsong = await yt720(q)
const docsongdown = await conn.sendMessage(from , { text: config.VIDEO_DOWN }, { quoted: mek } )
await conn.sendMessage(from, { delete: docsongdown.key })
const docsongup = await conn.sendMessage(from , { text: config.VIDEO_UP }, { quoted: mek } )
await conn.sendMessage(from ,{ video: { url : docsong.url } , caption: config.CAPTION } , { quoted: mek })
await conn.sendMessage(from, { delete: docsongup.key })
    
		      
	      } catch(e) {
		await conn.sendMessage(from , { text: 'error' }, { quoted: mek } )      
	      }      
	      break   
		      
  // _ _ _ _ _ _ _ _ __  _ _ _ _ _ _  __  _ _ _ __ _  __ _  _ _ _ _ __ _ _  __  __ _  _ __  _ __ _ _ _  _ __ _  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __  __ _  __ _ _ _ _   //   		      
		      
		 case '480vid' :
	      try {
	     if(!q) return await conn.sendMessage(from , { text: 'need yt link' }, { quoted: mek } )      
	     
             if ( !q.includes('youtu') ) return await conn.sendMessage(from , { text: 'need yt link' }, { quoted: mek } )  
	   let docsong = await yt480(q)
const docsongdown = await conn.sendMessage(from , { text: config.VIDEO_DOWN }, { quoted: mek } )
await conn.sendMessage(from, { delete: docsongdown.key })
const docsongup = await conn.sendMessage(from , { text: config.VIDEO_UP }, { quoted: mek } )
await conn.sendMessage(from ,{ video: { url : docsong.url } , caption: config.CAPTION } , { quoted: mek })
await conn.sendMessage(from, { delete: docsongup.key })
		      
	      } catch(e) {
		await conn.sendMessage(from , { text: 'error' }, { quoted: mek } )      
	      }      
	      break  
  // _ _ _ _ _ _ _ _ __  _ _ _ _ _ _  __  _ _ _ __ _  __ _  _ _ _ _ __ _ _  __  __ _  _ __  _ __ _ _ _  _ __ _  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __  __ _  __ _ _ _ _   //   		      
		      
	      case 'yts' :
		      try {
		      if (!q) return await conn.sendMessage(from , { text: 'Ø£ÙØªØ¨ Ø¹ÙÙØ§Ù Ø§ÙÙÙØ¯ÙÙ Ø§ÙØ¯Ù ØªÙØ¯ Ø§ÙØ¨Ø­Ø« Ø¹ÙÙ'  }, { quoted: mek } )
		try {
var arama = await yts(q);
} catch(e) {
return await conn.sendMessage(from , { text: 'ÙÙ ÙØªÙ Ø§ÙØ¹Ø«ÙØ± Ø¹ÙÙ Ø§Ù Ø´ÙØ¡ ' }, { quoted: mek } )
}
var mesaj = '';
arama.all.map((video) => {
mesaj += ' *ð²ï¸' + video.title + '*\nð ' + video.url + '\n\n'
});
const srcres = await conn.sendMessage(from , { text:  mesaj }, { quoted: mek } )
} catch(e) {
await conn.sendMessage(from , { text: 'error' }, { quoted: mek } )  
}  
		      break
		      
 //_______________________________________________________________________________________________________________________________________________________   //		      
		      
		// playstore // 
		      
	      case "apk" :
	      case "findapk":
		     try {
			 if (!q) return await conn.sendMessage(from , { text: 'Ø§ÙÙ ÙÙ Ø§Ø³Ù Ø§ÙØ§ØªØ·Ø¨ÙÙ Ø§ÙØ°Ù ØªØ±ÙØ¯ ØªØ­ÙÙÙÙ' }, { quoted: mek } )        
		     const data2 = await axios.get('https://bobiz-api.herokuapp.com/api/playstore?q=' + q)
		     const data = data2.data
		     if (data.length < 1) return await  conn.sendMessage(from, { text: e2Lang.N_FOUND }, { quoted: mek } )
	  var srh = [];  
		   for (var i = 0; i < data.length; i++) {
      srh.push({
          title: data[i].title,
          description: '',
          rowId: prefix + 'dapk ' + data[i].link
      });
  }
    const sections = [{
      title: "Ø§ÙØ¨Ø­Ø« ÙÙ Ø¨ÙØ§Ù Ø³ØªÙØ±",
      rows: srh
  }]
    const listMessage = {
      text: " \n\n name : " + q + '\n\n ',
      footer: config.FOOTER,
      title: 'ð¥B O R I M O - BOTâ ØªØ­ÙÙÙ Ø§ÙØªØ·Ø¨ÙÙØ§Øª',
      buttonText: "ÙØªØ§Ø¦Ø¬ Ø§ÙØ¨Ø­Ø« Ø§Ø¶ØºØ· ÙÙØ§",
      sections
  }
    await conn.sendMessage(from, listMessage, {quoted: mek })
		      } catch(e) {
await conn.sendMessage(from , { text: 'error' }, { quoted: mek } )  
} 
		      
	 break
// _ _ _ _ _ _ _ _ __  _ _ _ _ _ _  __  _ _ _ __ _  __ _  _ _ _ _ __ _ _  __  __ _  _ __  _ __ _ _ _  _ __ _  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __  __ _  __ _ _ _ _   //   		      
	
	      case 'dapk' :   
		try {
	   if(!q) return await conn.sendMessage(from , { text: 'need app link' }, { quoted: mek } ) 
			 const n = q.replace('/store/apps/details?id=', '')
	  const data = await axios.get('https://bobiz-api.herokuapp.com/api/apk?url=https://play.google.com/store/apps/details?id=' + n)
	 const name = data.data.name		
	   const fileup = await conn.sendMessage(from , { text: config.FILE_DOWN }, { quoted: mek } )
	   await conn.sendMessage(from, { delete: fileup.key })
           const filedown = await conn.sendMessage(from , { text: config.FILE_UP }, { quoted: mek } )
	  
	 	 const app_link = await apk_link(n)
	  if ( app_link.size.replace('MB' , '') > 200) return await conn.sendMessage(from , { text: 'Ø§ÙØªØ·Ø¨ÙÙ Ø§ÙØ°Ù ØªØ±ÙØ¯Ù Ø­Ø¬ÙÙ ÙØ¨ÙØ± ÙØ§ ÙÙÙÙ ÙØ¨ÙØ¨ÙØ² Ø§Ù ÙØ±Ø³ÙÙ Ø§ÙØ­Ø¯ Ø§ÙØ§ÙØµÙ ÙÙ 200 ÙÙØºØ§' }, { quoted: mek } )
         if ( app_link.size.includes('GB')) return await conn.sendMessage(from , { text: ' Ø§ÙØªØ·Ø¨ÙÙ Ø§ÙØ°Ù ØªØ±ÙØ¯Ù Ø­Ø¬ÙÙ ÙØ¨ÙØ± ÙØ§ ÙÙÙÙ ÙØ¨ÙØ¨ÙØ² Ø§Ù ÙØ±Ø³ÙÙ Ø§ÙØ­Ø¯ Ø§ÙØ§ÙØµÙ ÙÙ 200 ÙÙØºØ§' }, { quoted: mek } )
		  var ext = ''
		  if (app_link.type.includes('Download XAPK')) { ext = '.xapk' } 
		  else { ext = '.apk' }
         await conn.sendMessage(from , { document : { url : app_link.dl_link  } , mimetype : 'application/vnd.android.package-archive' , fileName : name + ext } , { quoted: mek })
         await conn.sendMessage(from, { delete: filedown.key })
		}
		      catch(e) {
await conn.sendMessage(from , { text: 'ØªØ¹Ø°Ø± Ø§Ø±Ø³Ø§Ù Ø§ÙØªØ·Ø¨ÙÙ Ø¢Ø³Ù ØµØ¯ÙÙÙ \n\n' + e }, { quoted: mek } )  
} 
		      
	      break      
		      
 //_______________________________________________________________________________________________________________________________________________________   //		      
	// menu // 	      
		      
		case 'menu' :
		case 'list' :      
	        case 'panal' : 
		 await conn.sendMessage(from , { audio : fs.readFileSync("./src/alive.mpeg") , mimetype : 'audio/mpeg' , ptt: true  } , { quoted: mek })
		      const msg = `â­âââââââââââââââââââââ®
                  BOBIZ BOT
â°âââââââââââââââââââââ¯
â­âââââââââââââââââââââ®
â â  @Borimo___
â°âââââââââââââââââââââ¯
www.instagram.com/borimo___
âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
â­âââââââââââââââââââââ®
        Ø§ÙØ£ÙØ§ÙÙÙÙÙÙÙØ± : menu
â°âââââââââââââââââââââ¯
â­âââââââââââââââââââââ®
â  â¸ .sticker         ØµÙØ§Ø¹Ø© ÙÙØµÙØ§Øª
â  â¸ .apk             ØªØ­ÙÙÙ ØªØ·Ø¨ÙÙØ§Øª
â  â¸ .fb            Ø§ÙØªØ­ÙÙÙ ÙÙ ÙÙØ³Ø¨ÙÙ
â  â¸ .ig          Ø§ÙØªØ­ÙÙÙ ÙÙ Ø§ÙØ§ÙØ³ØªØºØ±Ø§Ù
â  â¸ .tiktok        Ø§ÙØªØ­ÙÙÙ ÙÙ ØªÙÙØªÙÙ
â  â¸ .yt            Ø§ÙØªØ­ÙÙÙ ÙÙ ÙÙØªÙØ¨
â  â¸ .yts           Ø§ÙØ¨Ø­Ø« ÙÙ Ø§ÙÙÙØªÙØ¨
â  â¸ .mediafire        ÙÙØ¯ÙØ§ÙØ§ÙØ± " "
â  â¸ .stickget         Ø­ÙÙÙ Ø§ÙÙÙØµÙ
â  â¸ .alive      ÙÙ Ø§ÙØ¨ÙØª Ø´ØºØ§Ù Ø§Ù ÙØ§
â  â¸ .song           ØªØ­ÙÙÙ Ø§ÙÙÙØ³ÙÙÙ 
â°âââââââââââââââââââââ¯
     ÊÊ É´á´á´Êá´á´á´ÉªÉ´á´ á´á´á´ÒÊ`
		      await conn.sendMessage(from , { text: msg }, { quoted: mek } )  
		      
		      break
  // _ _ _ _ _ _ _ _ __  _ _ _ _ _ _  __  _ _ _ __ _  __ _  _ _ _ _ __ _ _  __  __ _  _ __  _ __ _ _ _  _ __ _  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __  __ _  __ _ _ _ _   //   		      
	/*	      
	      case 'owner' :
		const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
            + 'VERSION:3.0\n' 
            + `FN:` + 'noureddine_ouafy' + `\n` // full name
            + 'TEL;type=CELL;type=VOICE;waid=' + '212605784394' + ':+' + '212605784394' + '\n' // WhatsApp ID + phone number
            + 'END:VCARD'
 await conn.sendMessage(from,{ contacts: { displayName: 'noureddine_ouafy' , contacts: [{ vcard }]  }} , { quoted: mek })      
		      break 
		      */
 //_______________________________________________________________________________________________________________________________________________________   //		      
		      
      }

}catch(e) {
const isError = String(e)
console.log( isError )
}


}

module.exports = cmd
	
