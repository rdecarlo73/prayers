var mongodb = require('mongodb').Db
var BSON = require('mongodb').BSONPure;

if(process.env.VCAP_SERVICES){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var mongo = env['mongodb-1.8'][0]['credentials'];
}
else{
    var mongo = {
        "hostname":"localhost",
        "port":27017,
        "username":"",
        "password":"",
        "name":"",
        "db":"prayersdb"
    }
}
var generate_mongo_url = function(obj){
	if(process.env.MONGOLAB_URI){
		return process.env.MONGOLAB_URI;
	}
	if(process.env.MONGOLAB_URI){
		return process.env.MONGOLAB_URI;
	}
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'prayersdb');
    if(obj.username && obj.password){
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    else{
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
}
var mongourl = generate_mongo_url(mongo);

mongodb.connect(mongourl, function(err, db) {
	console.log("Connected to 'prayersdb' database");
	db.collection('prayers', {safe:true}, function(err, collection) {
	 	if (err) {
			console.log("The 'prayers' collection doesn't exist. Creating it with sample data...");
	        populateDB(db);
	    }
	});
});
		
exports.findRandom = function(req, res) {
    var id = Math.floor(Math.random()*63);
    console.log('Retrieving random prayer: ' + id);
	mongodb.connect(mongourl, function(err, db) {
		db.collection('prayers', function(err, collection) {
	        collection.find({}, {skip:id, limit:1}).toArray(function(err, items) {
				console.log(items);
				var item = items[0];
				console.log(item);
				item.id = id;
	            res.send(item);
	        });
	    });
	});
};

exports.findByIndex = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving prayer: ' + id);
	mongodb.connect(mongourl, function(err, db) {
		db.collection('prayers', function(err, collection) {
	        collection.find({}, {skip:id, limit:1}).toArray(function(err, items) {
				console.log(items);
				var item = items[0];
				console.log(item);
				item.id = id;
	            res.send(item);
	        });
	    });
	});
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving prayer: ' + id);
	mongodb.connect(mongourl, function(err, db) {
	    db.collection('prayers', function(err, collection) {
	        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
	            res.send(item);
	        });
	    });
	});
};

exports.findAll = function(req, res) {
	mongodb.connect(mongourl, function(err, db) {
	    db.collection('prayers', function(err, collection) {
	        collection.find().toArray(function(err, items) {
	            res.send(items);
	        });
	    });
	});
};

// exports.addWine = function(req, res) {
//     var wine = req.body;
//     console.log('Adding wine: ' + JSON.stringify(wine));
//     db.collection('wines', function(err, collection) {
//         collection.insert(wine, {safe:true}, function(err, result) {
//             if (err) {
//                 res.send({'error':'An error has occurred'});
//             } else {
//                 console.log('Success: ' + JSON.stringify(result[0]));
//                 res.send(result[0]);
//             }
//         });
//     });
// }
// 
// exports.updateWine = function(req, res) {
//     var id = req.params.id;
//     var wine = req.body;
//     console.log('Updating wine: ' + id);
//     console.log(JSON.stringify(wine));
//     db.collection('wines', function(err, collection) {
//         collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
//             if (err) {
//                 console.log('Error updating wine: ' + err);
//                 res.send({'error':'An error has occurred'});
//             } else {
//                 console.log('' + result + ' document(s) updated');
//                 res.send(wine);
//             }
//         });
//     });
// }
// 
// exports.deleteWine = function(req, res) {
//     var id = req.params.id;
//     console.log('Deleting wine: ' + id);
//     db.collection('wines', function(err, collection) {
//         collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
//             if (err) {
//                 res.send({'error':'An error has occurred - ' + err});
//             } else {
//                 console.log('' + result + ' document(s) deleted');
//                 res.send(req.body);
//             }
//         });
//     });
// }

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function(db) {

	var prayers = [
	    {
	        "text": "Prayer to St. Jude patron of hopeless causes\n\rSt. Jude, glorious apostle, faithful servant and friend of Jesus, the name of the traitor has caused you to be forgotten by many, but the true Church invokes you universally as the patron of things despaired of; pray for me, who am so downcast; pray for me, that finally I may receive the consolations and help of heaven in all my necessities, tribulations and sufferings, particularly (make your request here), and that I may bless God with the elect throughout eternity. Amen. \n\rSt. Jude Apostle, martyr and relative of our Lord Jesus Christ, of Mary, and of Joseph, intercede for us. Amen.\n\r"
	    },
	    {
	        "text": "Prayer for Serenity by Reinhold Niebuhr\n\rGod, grant me the serenity\n\rTo accept the things I cannot change,\n\rCourage to change the things I can,\n\rAnd wisdom to know the difference.\n\rLiving one day at a time,\n\rEnjoying one moment at a time,\n\rAccepting hardship as a way to peace,\n\rTaking, as Jesus did,\n\rThis sinful world as it is,\n\rNot as I would have it,\n\rTrusting that You will make all things right,\n\rIf I surrender to Your will,\n\rSo that I may be reasonably happy in this life,\n\rAnd supremely happy with You forever in the next.\n\rAmen.\n\r"
	    },
	    {
	        "text": "Act of Love\n\rO my God, I love you above all things, with my whole heart and soul, because you are all-good and worthy of all my love. I love my neighbor as myself for the love of you. I forgive all who have injured me and ask pardon of all who I have injured.\n\rAct of Hope\n\rO my God, relying on your almighty power, infinite mercy and promises, I hope to obtain pardon for my sins, the help of your grace, and life everlasting through the merits of Jesus Christ, my Lord and Redeemer.\n\rAct of Faith\n\rO my God, I firmly believe that you are one God in three divine Persons, Father, Son, and Holy Spirit. I believe that your divine Son became man, died for our sins, and that he will come to judge the living and the dead. I believe these and all the truths which the holy Catholic Church teaches, because you have revealed them, Who can neither deceive nor be deceived.\n\r"
	    },
	    {
	        "text": "Prayer of Abandonment \n\rb\n\ry. Ven. Charles de Foucauld\n\rFather, I abandon myself into Your hands;\n\rDo with me what You will.\n\rWhatever You may do\n\rI thank you;\n\rI am ready for all, I accept all.\n\rLet only Your will be done in me\n\rAnd in all Your creatures – \n\rI wish no more than this, O Lord.\n\rInto Your hands I commend my soul;\n\rI offer it to You\n\rWith all the love of my heart,\n\rFor I love You, Lord,\n\rAnd so need to give myself,\n\rTo surrender myself into Your hands,\n\rWithout reserve,\n\rAnd with boundless confidence,\n\rFor You are my Father.\n\r"
	    },
	    {
	        "text": "Prayer Not to be Disturbed By St. Teresa of Avila\n\rLet nothing disturb you.\n\rLet nothing frighten you.\n\rAll things pass.\n\rGod never changes.\n\rPatience attains all that it strives for.\n\rHe who has God finds he lacks nothing.\n\rGod alone suffices.\n\r"
	    },
	    {
	        "text": "Prayer to the Holy Spirit By St. Augustine\n\rBreathe in me, Holy Spirit,\n\rThat all my thoughts may be holy.\n\rMove in me, Holy Spirit,\n\rThat my work, too, may be holy.\n\rAttract my heart, Holy Spirit,\n\rThat I may love only what is holy.\n\rStrengthen me, Holy Spirit,\n\rThat I may defend all that is holy.\n\rProtect me, Holy Spirit,\n\rThat I always may be holy.\n\r"
	    },
	    {
	        "text": "Prayer for Your Family\n\rLord Jesus, I pray for my family.\n\rBless those who help me\n\rAnd bless those who hurt me.\n\rBless those who are at home\n\rAnd bless those who are away fro home.\n\rBless those whom I find easy to love\n\rAnd bless those who I find\n\rDifficult/impossible to love.\n\rLord, bless al the members of my family who have died.\n\rBless them with eternal rest and peace.\n\rLord, bless all the members of my family.\n\r"
	    },
	    {
	        "text": "Prayer of Thanksgiving\n\rAlmighty Father,\n\rYou are lavish in bestowing all your gifts,\n\rAnd we give thanks for the favors you have given to us.\n\rIn your goodness you have favored us and kept us safe in the past.\n\rWe ask that you continue to protect us and to shelter us in the shadow of your wings.\n\rWe ask this through Christ our Lord. Amen.\n\r"
	    },
	    {
	        "text": "Prayer in Time of Sorrow\n\rFather of all mercies and God of consolation, you love us eternally and transform the shadows of death into the dawn of life. Look upon our grief; be our refuge and comfort so that our sadness and sorrow may turn into to the light and peace of your presence. In dying, your Son destroyed death; in rising, he restored life. Grant that at the end of our earthly pilgrimage we may be found in his company with our brothers and sisters. There you shall wipe away every tear. We ask this through Christ our Lord. Amen.\n\r"
	    },
	    {
	        "text": "Prayer for When You’re Confused\n\rLord Jesus, I’m really confused.\n\rI really don’t know why\n\rAnd I don’t know what to do\n\rAnd I can’t help the way I fell.\n\rSo I’m coming to You.\n\rLord Jesus, speak a Word\n\rTo scatter the darkness\n\rIn my mind and heart.\n\rBurn away the clouds of uncertainty.\n\rShed a ray of Your Divine Light\n\rWith its healing rays to set me straight.\n\rMy mind, my heart, my body, my soul,\n\rI give to You… take control.\n\rJesus, I trust in You.\n\r"
	    },
	    {
	        "text": "Prayer of St. Thérèse of Lisieux from The Story of A Soul\n\rOpen the Book of life, Lord Jesus,\n\rSee all the deeds recorded by the saints!\n\rAll these I want to perform for You!\n\rWhat can You say in the face of\n\rAll this foolishness of mine,\n\rFor surely I am the weakest soul on earth?\n\rYet just because I am so weak\n\rYou have been pleased to grant\n\rMy childish little desires,\n\rAnd now You will grant the rest,\n\rOther desires far greater than the Universe.\n\r"
	    },
	    {
	        "text": "Prayer Before the Crucifix By St. Francis of Assisi\n\rMost high,\n\rGlorious God,\n\rEnlighten the darkness of my heart\n\rAnd give me, Lord,\n\rA correct faith,\n\rA correct hope,\n\rA perfect charity,\n\rSense and knowledge,\n\rSo that I may carry out Your holy and true command.\n\r"
	    },
	    {
	        "text": "Prayer to Our Lady in Spanish\n\rMadre mía amantísima, en todos los instantes de mi vida, acordaos de mí, miserable pecador. Acueducto de las divinas gracias, concededme abundancia de lágrimas para llorar amargamente mis pecados.\n\rReina de cielos y tierra, sed mi amparo y defensa en las tentaciones de mis enemigos.\n\rIlustre y querida hija de Joaquín y Ana, alcanzadme de vuestro Divino Hijo las gracias que necesito para mi salvacíon. \n\rAbogado y refugio de los pecadores, asistidme en mi última agonía y abridme las puertas del Cielo.\n\r"
	    },
	    {
	        "text": "Prayer to the Divine Infant Jesus\n\rOh Divine Infant Jesus,\n\rOmnipotent God\n\rWe implore you,\n\rThrough the powerful\n\rIntercession of your\n\rMost holy Mother\n\rIn your boundless\n\rMercy and omnipotence\n\rTo look favorably upon\n\rThe petition for which we so earnestly pray.\n\rOh Divine Infant Jesus\n\rHear our prayers\n\rAnd grant our petitions.\n\r"
	    },
	    {
	        "text": "Daily Prayer to the Sacred Heart\n\rSacred Heart of Jesus today I wish to live in You, in Your grace, in which I desire at all costs to persevere.\n\rKeep me from sin and strengthen my will by helping me to keep watch over my senses,\n\rMy imagination, and my heart.\n\rHelp me to correct my faults which are the source of sin.\n\rI beg You to do this, O Jesus, through Mary, Your Immaculate Mother. Amen.\n\r"
	    },
	    {
	        "text": "St. Catherine of Siena (feast day April 29)\n\rO marvelous wonder of the Church, seraphic virgin, Saint Catherine, because of your extraordinary virtue and immense good which you accomplished for the Church and society, you are acclaimed and blessed by all people.\n\rBy the sheer force of your personality you converted thousands, and the mere sight of you melted the hearts of hardened sinners.\n\rO St. Catherine, inspire me to reach into they lives of others and influence them for good, so that your name will be ever blessed and exalted.\n\rI call upon you with all my affection and beg you to obtain by your prayers the favors I so ardently desire. Amen.\n\r"
	    },
	    {
	        "text": "Prayer to St. Joseph (indulgence, 3 years; plenary, under usual conditions, for month’s recitation)\n\rSt. Joseph, father and guardian of virgins, into whose faithful keeping were entrusted Innocency itself, Christ Jesus, and Mary, the Virgin of virgins, I pray and beseech thee through Jesus and Mary, those pledges so dear to thee, to keep me from all uncleanness, and to grant that my mind may be untainted, my heart pure and my body chaste; help me always to serve Jesus and Mary in perfect chastity. Amen\n\r"
	    },
	    {
	        "text": "Prayer to St. Cecilia (feast day Nov. 22\n\rnd\n\r)\n\rO glorious saint, who chose to die\n\rInstead of denying your King,\n\rWe pray you please to help us\n\rAs His fair praise we sing!\n\rWe lift our hearts in joyous song\n\rTo honor Him this way,\n\rAnd while we sing, remembering\n\rTo sing is to doubly pray.\n\rAt once in our hearts and in our tongues\n\rWe offer double prayer\n\rSent heavenward on winged notes\n\rTo praise God dwelling there.\n\rWhile in our hearts and tongues we try\n\rWith song to praise God twice,\n\rWe ask dear saint, to help us be\n\rUnited close to Christ!\n\r"
	    },
	    {
	        "text": "Prayer to the Immaculate Heart of Mary: Novena Prayer\n\rO Most Blessed Mother, heart of love, heart of mercy, every listening, caring, consoling, hear our prayer. As your children, we implore your intercession with Jesus your Son.\n\rReceive with understanding and compassion the petitions we place before you today, especially (special intention).\n\rWe are comforted in knowing your heart is ever open to those who ask for you prayer.\n\rWe trust to your gentle care and intercession, those whom we love and who are sick or lonely or hurting. Help all of us, Holy Mother to bear our burdens in this life until we may share eternal life and peace with God forever. Amen.\n\r"
	    },
	    {
	        "text": "Prayer to St. Thomas Aquinas\n\rAngel of Schools, at the bidding of Peter,\n\rThousands today are saluting thee thus.\n\rWe too are claiming thy care and thy counsel,\n\rAngel of  Schools, be an Angel to us.\n\rCome to our aid when thou hearest us calling,\n\rLight up the dark, make the rough places plain,\n\rBring to our thoughts the unknown or forgotten,\n\rGive us the words that we seek for in vain.\n\r"
	    },
	    {
	        "text": "Prayer in Honor of St. Lucy\n\rO God, our Creator and Redeemer, mercifully hear our prayers that as we venerate Thy servant, St. Lucy, for the light of faith Thou dist bestow upon her, Thou wouldst vouchsafe to increase and to preserve this same light in our souls, that we may be able to avoid evil, to do good and to abhor nothing so much as the blindness and the darkness of evil and of sin.\n\rRelying on Thy goodness, O God, we humbly ask Thee, by the intercession of Thy servant, St. Lucy that Thou wouldst give perfect vision to our eyes, that they may serve for Thy greater honor and glory, and for the salvation of our souls in this world, that we may come to the enjoyment of the unfailing light of the Lamb of God in paradise.\n\rSt. Lucy, virgin and martyr, hear our prayers and obtain our petitions.\n\r"
	    },
	    {
	        "text": "Prayer to St. Maria Goretti\n\rHeroic and angelic St. Maria Goretti, we kneel before you to honor your preserving fortitude and to beg your gracious aid. Teach us a deep love the precepts of our Holy Church; and help us to see in them the very voice of our Father in heaven. May we preserve without stain our white baptismal robe of innocence. May we who have lost this innocence kneel humbly in Holy Penance; and with the absolution of Christ’s precious Blood flow into our souls and give us new courage to carry the burning light of God’s love through the dangerous highways of this life until Christ our King shall call us to the courts of heaven.\n\r"
	    },
	    {
	        "text": "Prayer to St. Dominic\n\rO holy Priest of God and glorious Patriarch, St. Dominic, thou who wast the friend, the well-beloved son and confidant of the Queen of Heaven, and didst work so many miracles by the power of the Holy Rosary, have regard for my necessities.\n\rOn earth you opened your heart to the miseries of your fellow men and your hands were strong to help them; now in heaven your charity has not grown less nor has your power wane.\n\rPray for me to the Mother of the Rosary and to her divine Son, for I have great confidence that through your assistance I shall obtain the favor I so much desire. Amen.\n\r"
	    },
	    {
	        "text": "THE PRAYER OF SAINT ANSELM IN TIME OF SPIRITUAL DRYNESS\n\rO supreme and inaccessible Light,\n\rO complete and blessed Truth,\n\rHow far You are from me,\n\rEven though I am so near to You!\n\rHow remote You are from my sight,\n\rEven though I am present to Yours!\n\rYou are everywhere in your entirety,\n\rAnd yet I do not see You;\n\rIn You I move and have my being,\n\rAnd yet I cannot approach You.\n\rO God, let me know You\n\rAnd love You so that I may find my joy in You;\n\rAnd if I cannot do so fully in this life,\n\rLet me at least make some progress every day,\n\rUntil at last that knowledge, love,\n\rAnd joy come to me in all their plentitude.\n\rAmen\n\r"
	    },
	    {
	        "text": "Pater Noster\n\r"
	    },
	    {
	        "text": "PATER NOSTER, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. \n\rPanem nostrum quotidianum da nobis hodie, et dimitte nobis debita nostra sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. \n\rAmen.\n\rOur Father\n\rOUR FATHER, Who art in heaven hallowed be Thy name. Thy kingdom come; Thy will be done on earth, as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us. And lead us not into temptation; but deliver us from evil. \n\rAmen.\n\r"
	    },
	    {
	        "text": "Ave Maria\n\rAVE MARIA, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc, et in hora mortis nostrae. \n\rAmen.\n\rHail Mary\n\rHAIL, MARY, full of grace; the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. \n\rAmen.\n\r"
	    },
	    {
	        "text": "Salve Regina\n\rSALVE REGINA, Mater misericordiae. Vita, dulcedo, et spes nostra, salve. Ad te clamamus exsules filii Hevae. Ad te Suspiramus, gementes et flentes in hac lacrimarum valle. Eia ergo, Advocata nostra, illos tuos misericordes oculos ad nos converte. \n\rEt Iesum, benedictum fructum ventris tui, nobis post hoc exsilium ostende. \n\rO clemens, o pia, o dulcis Virgo Maria. \n\rV. Ora pro nobis, Sancta Dei Genetrix.\n\r[object Object]\n\rR. Ut digni efficiamur promissionibus Christi. \n\rHail, Holy Queen\n\rHail, holy Queen, Mother of Mercy; our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve; to thee do we send up our sighs, mourning and weeping in this valley of tears.\n\rTurn, then, most gracious advocate, thine eyes of mercy towards us; and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. \n\rV. Pray for us, O holy Mother of God.\n\rR. That we may be made worthy of the promises of Christ. \n\r"
	    },
	    {
	        "text": "Sancte Michael Archangele\n\rSancte Michael Archangele, defende nos in proelio, contra nequitiam et insidias diaboli esto praesidium. Imperet illi Deus, supplices deprecamur: tuque, Princeps militiae coelestis, Satanam aliosque spiritus malignos, qui ad perditionem animarum pervagantur in mundo, divina virtute, in infernum detrude. \n\rAmen.\n\rPrayer to Saint Michael\n\rSt. Michael the Archangel, defend us in battle; be our defense against the wickedness and snares of the devil. May God rebuke him, we humbly pray. And do thou, O prince of the heavenly host, by the power of God thrust into hell Satan and all the evil spirits who prowl about the world for the ruin of souls. Amen.\n\r"
	    },
	    {
	        "text": "Prayer of St. Anselm to Mary Mother of Salvation\n\rMother of Salvation \n\rBlessed Lady, \n\rYou are the Mother of Justification \n\rAnd of those who are justified; \n\rThe Mother of Reconciliation \n\rAnd of those who are reconciled; \n\rThe Mother of Salvation \n\rAnd of those who are saved. \n\rWhat a blessed trust,\n\rand what a secure refuge! \n\rThe Mother of God is our Mother. \n\rThe Mother of the One in whom alone \n\rWe hope and whom alone we fear is our Mother!\n\rThe One who partook of our nature,\n\rAnd by restoring us to life \n\rMade us children of His Mother, \n\rInvites us by this to proclaim \n\rThat we are His brothers and sisters. \n\rTherefore, our Judge is also our Brother. \n\rThe Saviour of the world is our Brother. \n\rOur God has become, through Mary, our Brother!\n\r[object Object]\n\r"
	    },
	    {
	        "text": "Prayer of St. Francis\n\rLord, make me an instrument of Your peace.\n\rWhere there is hatred, let me sow love;\n\rwhere there is injury, pardon;\n\rwhere there is doubt, faith;\n\rwhere there is despair, hope;\n\rwhere there is darkness, light;\n\rand where there is sadness, joy.\n\rO, Divine Master,\n\rgrant that I may not so much seek\n\rto be consoled as to console;\n\rto be understood as to understand;\n\rto be loved as to love;\n\rFor it is in giving that we receive;\n\rit is in pardoning that we are pardoned;\n\rand it is in dying that we are born to eternal life.\n\r"
	    },
	    {
	        "text": "Individual Prayers for Meditation\n\rThe Jesus Prayer\n\rLord Jesus Christ, Son of God, have mercy on me, a sinner.\n\rSt. Francis’ Prayer:\n\rJesus, it’s me, ______ (your name).\n\r(In silence listen for the reply: ) ______ it’s me, Jesus.\n\rBless the Lord, my soul, and bless God's holy name, Bless the Lord, my soul, who leads me into life\n\rBe still and know that I am God.\n\rBe still and know that I am.\n\rBe still and know.\n\rBe still.\n\rBe.\n\r"
	    },
	    {
	        "text": "Prayer by Saint Thomas Aquinas\n\rTANTUM ERGO\n\rDown in adoration falling,\n\rLo! the sacred host we hail;\n\rLo! o'er ancient forms departing,\n\rNewer rites of graces prevail;\n\rFaith for all defects supplying,\n\rWhere the feeble senses fail.\n\rTo the everlasting Father,\n\rAnd the Son, who reigns on high,\n\rWith the Holy Ghost proceeding\n\rForth from each eternally,\n\rBe salvation, honour, blessing,\n\rMight and endless majesty.\n\rAmen.\n\rV. Thou gavest them bread from heaven.\n\rR. And therein was sweetness of every kind.\n\rLet Us Pray.\n\rO God, Who, under this wonderful Sacrament,\n\rhast left unto us the memorials of Thy Passion;\n\rgrant us, we beseech Thee, \n\rso to venerate the sacred mysteries of Thy Body and Thy Blood,\n\rthat we may constantly experience within us the fruit of Thy redemption.\n\r"
	    },
	    {
	        "text": "The Magnificat (English)\n\rMy soul proclaims the greatness of the Lord,\n\rMy spirit rejoices in God my Saviour,\n\rFor he has looked with favor on his lowly servant.\n\rFrom this day all generations will call me blessed:\n\rThe Almighty has done great things for me,\n\rAnd Holy is His Name.\n\rHe has mercy on those who fear Him,\n\rIn every generation.\n\rHe has shown the strength of his arm,\n\rHe has scattered the proud in their conceit.\n\rHe has cast down the mighty from their thrones,\n\rAnd has lifted up the lowly.\n\rHe has filled the hungry with good things,\n\rAnd the rich He has sent away empty.\n\rHe has come to the help of his servant Israel\n\rFor He has remembered His promise of mercy,\n\rThe promise He made to our fathers,\n\rTo Abraham and his children for ever.\n\rGlory be to the Father and to the Son and to the Holy Spirit. \n\rAs it was in the beginning, is now and ever shall be, world without end. Amen\n\r"
	    },
	    {
	        "text": "The Magnificat (Latin)\n\rMagnificat anima mea Dominum;\n\rEt exultavit spiritus meus in Deo salutari meo,\n\rQuia respexit humilitatem ancillae suae; ecce enim ex hoc beatam me dicent omnes generationes.\n\rQuia fecit mihi magna qui potens est, et sanctum nomen ejus,\n\rEt misericordia ejus a progenie in progenies timentibus eum. \n\rFecit potentiam brachio suo; \n\rDispersit superbos mente cordis sui.\n\rDeposuit potentes de sede, et exaltavit humiles.\n\rEsurientes implevit bonis, et divites dimisit inanes. \n\rSucepit Israel, puerum suum, recordatus misericordiae suae,\n\rSicut locutus est ad patres nostros, Abraham et semeni ejus in saecula.\n\rGloria Patri, et Filio, et Spiritui Sancto.\n\rSicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.\n\r"
	    },
	    {
	        "text": "For our Enemies\n\rO God, the Father of all, whose Son commanded us to love our enemies: Lead them and us from prejudice to truth; deliver them and us from hatred, cruelty, and revenge; and in your good time enable us all to stand reconciled before you; through Jesus Christ our Lord. Amen.\n\r"
	    },
	    {
	        "text": "PRAYER FOR A WILL TO PEACE\n\rAlmighty God, by whose grace we look for the day when nation shall not any more lift us sword against nation, nor people against people, and when mankind shall live without fear in security and peace, grant to us in this time of strife the will to labor for peace even while our sword is drawn to resist the oppressor. Let not the evil we oppose turn us from our purpose to achieve unity and concord among the nations of the earth, to your honor and glory, through Jesus Christ our Lord. Amen.\n\r"
	    },
	    {
	        "text": "Litany of Saint Anthony of Padua\n\rLord, have mercy on us. \n\rChrist, have mercy on us. \n\rLord, have mercy on us.\n\rChrist, hear us. \n\rChrist, graciously hear us. \n\rGod, the Father of Heaven, have mercy on us. \n\rGod, the Son, Redeemer \n\rof the world, have mercy on us\n\rGod, the Holy Spirit, have mercy on us. \n\rHoly Trinity, one God, have mercy on us. \n\rHoly Mary, \n\rSaint Anthony of Padua, \n\rSaint Anthony, glory of the Friars Minor, \n\rSaint Anthony, ark of the testament, \n\rSaint Anthony, sanctuary of heavenly wisdom, \n\rSaint Anthony, destroyer of worldly vanity, \n\rSaint Anthony, conqueror of impurity, \n\rSaint Anthony, example of humility, \n\rSaint Anthony, lover of the Cross, \n\rSaint Anthony, martyr of desire, \n\rSaint Anthony, generator of charity, \n\rSaint Anthony, zealous for justice, \n\rSaint Anthony, terror of infidels, \n\rSaint Anthony, model of perfection, \n\rSaint Anthony, consoler of the afflicted, \n\rSaint Anthony, restorer of lost things, \n\rSaint Anthony, defender of innocence, \n\rSaint Anthony, liberator of prisoners, \n\rSaint Anthony, guide of pilgrims, \n\rSaint Anthony, restorer of health. \n\rSaint Anthony, performer of miracles, \n\rSaint Anthony, restorer of speech to the mute, \n\rSaint Anthony, restorer of hearing to the deaf, \n\rSaint Anthony, restorer of sight to the blind, \n\rSaint Anthony, disperser of devils, \n\rSaint Anthony, reviver of the dead. \n\rSaint Anthony, tamer of tyrants, \n\rFrom the snares of the devil, Saint Anthony deliver us. From thunder, lightning and storms, Saint Anthony deliver us. \n\rFrom all evil of body and soul, Saint Anthony deliver us. Through your intercession, Saint Anthony protect us. Throughout the course of life, Saint Anthony protect us. Lamb of God, who takes away the sins of the world, spare us, O Lord. \n\rLamb of God, who takes away the sins of the world, graciously hear us, O Lord. \n\rLamb of God, who takes away the sins of the world, have mercy on us. \n\rV. Saint Anthony, pray for us. \n\rR. That we may be made worthy of the promises of Christ. \n\rO my God, may the pious commemoration of Saint Anthony, your Confessor and Proctor, give joy to your Church, that she may ever be strengthened with your spiritual assistance and merit to attain everlasting joy. Through Christ our Lord. Amen.\n\r"
	    },
	    {
	        "text": "Prayer to Saint Anthony of Padua, Guide of Pilgrims\n\rDear Saint Anthony, we are all pilgrims. We came from God and we are going to Him. He who created us will welcome us at journey's end. The Lord Jesus is preparing a place for all His brothers and sisters. Saint Anthony, Guide of Pilgrims, direct my steps in the straight path. Protect me until I am safely home in heaven. Help me in all my needs and difficulties. [name them] Franciscan Mission Associates\n\r"
	    },
	    {
	        "text": "A Prayer to the North American Martyrs (Feast, September 26)\n\rDear Saints Isaac Jogues, John Brebeuf, Noel Chabanel, Gabriel Lalemant, Anthony Daniel, Charles Garnier, Rene Goupil and John Lalande, we beg of you, pray for the people of this vast country ours.\n\rYou are the first canonized saints of the United States and Canada. We are glad to have you. We are happy to honor you. You know our country and its needs, and we know you are in heaven praying for us.\n\rThere is one very special favor we wish to ask of you. Dear Saints of North America, pray God to send us another saint, or better still, a number of them. Ask Him to have soon--a man or a woman, a boy or a girl from this country of ours raised to the honors of the altar. Let it be a farmer or a laborer, a housewife or a schoolboy, born and bred in these United States. Let it be some one who lived his whole life here--a Saint Joseph of Carville County, or a Saint Mary of Middletown, or a Saint William of New York.\n\rWe do not wish to displace you in our affections, but to add to your glorious number. You understand our desires in this, and we feel sure that we will obtain this great blessing for the salvation of the people of this land. Remember us now, and obtain this great blessing for us from God. Help us always to cooperate with the graces that God so richly and generously gives us, through Jesus Christ our Lord. Amen.\n\rTHE MARIAN PRAYER OF\n\rPOPE JOHN-PAUL II\n\rMother of the Redeemer, \n\rwith great joy we call you blessed. \n\rIn order to carry out His plan of salvation,\n\rGod the Father chose you before the creation of the world.\n\rYou believed in His love and obeyed His word. \n\rThe Son of God desired you for His Mother \n\rwhen He became man to save the human race.\n\rYou received Him with ready obedience and undivided heart. \n\rThe Holy Spirit loved you as His mystical spouse \n\rand filled you with singular gifts.\n\rYou allowed yourself to be led \n\rby His hidden powerful action. \n\rOn the eve of the third Christian Millennium, \n\rwe entrust to you the Church \n\rwhich acknowledges you and invokes you as Mother. \n\rTo you, Mother of human family and of the nations,\n\rwe confidently entrust the whole humanity,\n\rwith its hopes and fears.\n\rDo no let it lack the light of true wisdom. \n\rGuide its steps in the ways of peace.\n\rEnable all to meet Christ,\n\rthe Way, the Truth, and the Life. \n\rSustain us, O Virgin Mary, on our journey of faith \n\rand obtain for us the grace of eternal salvation.\n\rO clement, O loving, O sweet Mother of God \n\rand our Mother, Mary! \n\r"
	    },
	    {
	        "text": "THE PRAYER,\n\rMAJESTIC QUEEN OF HEAVEN\n\rMajestic Queen of Heaven and Mistress of the Angels, \n\rthou didst receive from God the power \n\rand commission to crush the head of Satan; \n\rwherefore we humbly beseech thee, \n\rsend forth the legions of heaven, \n\rthat, under thy command, \n\rthey may seek out all evil spirits, \n\rengage them everywhere in battle, \n\rcurb their insolence, \n\rand hurl them back into the pit of hell. \n\r\"Who is like unto God?\"\n\rO good and tender Mother, \n\rthou shalt ever be our hope \n\rand the object of our love. \n\rO Mother of God, \n\rsend forth the holy Angels to defend me \n\rand drive far from me the cruel foe.\n\rHoly Angels and Archangels, \n\rdefend us and keep us.\n\r"
	    },
	    {
	        "text": "A PRAYER FOR AFTER\n\rTHE HOLY MASS\n\rMay the tribute of my humble ministry \n\rbe pleasing to Thee, Holy Trinity. \n\rGrant that the sacrifice which I, \n\runworthy as I am, \n\rhave offered in the presence of Thy majesty \n\rmay be acceptable to Thee. \n\rThrough Thy mercy may it bring forgiveness to me \n\rand to all for whom I have offered it: \n\rthrough Christ our Lord. \n\rAmen. \n\r"
	    },
	    {
	        "text": "A PRAYER TO SAY BEFORE\n\r[object Object]\n\rTHE HOLY MASS\n\rLet me be a holy sacrifice \n\rand unite with God in the sacrament of His greatest love. \n\rI want to be one in Him in this act of love, \n\rwhere He gives Himself to me and I give myself as a sacrifice to Him. \n\rLet me be a holy sacrifice as I become one with Him \n\rin this my act of greatest love to Him.\n\rLet me unite with Him more, \n\rthat I may more deeply love Him. \n\rMay I help make reparation to His adorable Heart \n\rand the heart of His Mother, Mary. \n\rWith greatest love, \n\rI offer myself to You \n\rand pray that You will accept my sacrifice of greatest love. \n\rI give myself to You and unite in Your gift of Yourself to me. \n\rCome and possess my soul. \n\rCleanse me, strengthen me, heal me. \n\rDear Holy Spirit act in the heart of Mary \n\rto make me more and more like Jesus. \n\rFather, I offer this my sacrifice, \n\rmyself united to Jesus in the Holy Spirit to You. \n\rHelp me to love God more deeply in this act of my greatest love. \n\rGive me the grace to grow in my knowledge, \n\rlove and service of You \n\rand for this to be my greatest participation in the Mass. \n\rGive me the greatest graces to love You so deeply in this Mass, \n\rYou who are so worthy of my love.\n\r"
	    },
	    {
	        "text": "Litany of Humility\n\rRafael Cardinal Merry del Val (1865-1930),\n\rSecretary of State for Pope Saint Pius X\n\rO Jesus! meek and humble of heart, \n\rHear me.\n\rFrom\n\r[object Object]\n\rthe desire of being esteemed,\n\rDeliver me, Jesus.\n\r[object Object]\n\rFrom the desire of being loved...\n\rFrom the desire of being extolled ...\n\rFrom the desire of being honored ...\n\rFrom the desire of being praised ...\n\rFrom the desire of being preferred to others...\n\rFrom the desire of being consulted ...\n\rFrom the desire of being approved ...\n\rFrom the fear of being humiliated ...\n\rFrom\n\r[object Object]\n\rthe fear of being despised...\n\rFrom the fear of suffering rebukes ...\n\rFrom the fear of being calumniated ...\n\rFrom the fear of being forgotten ...\n\rFrom the fear of being ridiculed ...\n\rFrom the fear of being wronged ...\n\rFrom the fear of being suspected ...\n\rThat others may be loved more than I,\n\rJesus, grant me the grace to desire it.\n\rThat others may be esteemed more than I ...\n\rThat, in the opinion of the world,\n\rothers may increase and I may decrease ...\n\rThat others may be chosen and I set aside ...\n\rThat others may be praised and I unnoticed ...\n\rThat others may be preferred to me in everything...\n\rThat others may become holier than I,\n\r[object Object]\n\rprovided that I may become as holy as I should…\n\r"
	    },
	    {
	        "text": "Radiating Christ\n\r(daily prayer of Mother Theresa’s Missionaries of Charity)\n\rDear Jesus, help me to spread Your fragrance everywhere I go. \n\rFlood my soul with Your spirit and life. \n\rPenetrate and possess my whole being so utterly \n\rthat all my life may only be a radiance of Yours. \n\rShine through me and be so in me \n\rthat every soul I come in contact with may feel Your presence in my soul. \n\rLet them look up and see no longer me but only Jesus! \n\rStay with me and then I shall begin to shine as You shine, \n\rso to shine as to be a light to others; \n\rthe light, O Jesus, will be all from You; \n\rnone of it will be mine: \n\rit will be You shining on others through me. \n\rLet me thus praise You in the way You love best: \n\rby shining on those around me. \n\rLet me preach You without preaching, not by words, but by my example, \n\rby the catching force, \n\rthe sympathetic influence of what I do, \n\rthe evident fullness of the love my heart bears to You. \n\r"
	    },
	    {
	        "text": "The Anima Christi\n\r(The Anima Christi is a prayer from around the 14\n\rth\n\r century. It is still widely used after receiving the body and blood of Our Lord, Jesus Christ in Holy Communion.)\n\rSoul of Christ, sanctify me \n\rBody of Christ, save me \n\rBlood of Christ, inebriate me \n\rWater from Christ’s side, wash me \n\rPassion of Christ, strengthen me \n\rO good Jesus, hear me \n\rWithin Thy wounds hide me \n\rSuffer me not to be separated from Thee \n\rFrom the malicious enemy defend me \n\rIn the hour of my death call me \n\rAnd bid me come unto Thee \n\rThat I may praise Thee with Thy saints \n\rand with Thy angels \n\rForever and ever \n\rAmen\n\r"
	    },
	    {
	        "text": "Act of Contrition\n\rO my God, I am heartily sorry for my sins. In choosing to do wrong and failing to do good, I have sinned against you and your church.  I firmly intend, with help of your grace, to repent, to sin no more, and to avoid temptation. Our Savior Jesus Christ suffered and died for us. In his name, my God, have mercy. \n\r"
	    },
	    {
	        "text": "Acceptance of God’s Will\n\rIn all things may the most holy, the most just, and the most lovable will of God be done, \n\rpraised, and exalted above all forever. Your will be done, O Lord, Your will be done. \n\rThe Lord has given, the Lord has taken away; blessed be the name of the Lord.\n\r"
	    },
	    {
	        "text": "The Divine Praises\n\rBlessed be God.\n\rBlessed be His Holy Name.\n\rBlessed be Jesus Christ, true God and true man.\n\rBlessed be the name of Jesus.\n\rBlessed be His Most Sacred Heart.\n\rBlessed be Jesus in the Most Holy Sacrament of the Altar.\n\rBlessed be the Holy Spirit, the paraclete.\n\rBlessed be the great Mother of God, Mary most holy.\n\rBlessed be her holy and Immaculate Conception.\n\rBlessed be her glorious Assumption.\n\rBlessed be the name of Mary, Virgin and Mother.\n\rBlessed be Saint Joseph, her most chaste spouse.\n\rBlessed be God in His angels and in His Saints. \n\rMay the heart of Jesus, in the Most Blessed Sacrament, be praised, adored, and loved with grateful affection, at every moment, in all the tabernacles of the world, even to the end of time. Amen. \n\r"
	    },
	    {
	        "text": "The Angelus\n\rThe Angel of the Lord declared unto Mary \n\rAnd she conceived of the Holy Spirit  \n\rHail Mary\n\rBehold the handmaid of the Lord, \n\rBe it done unto me according to Thy  word.\n\rHail Mary\n\rAnd the Word was made flesh,\n\rAnd dwelt among us. \n\rHail Mary\n\rPray for us, O holy Mother of God, \n\rThat we may be made worthy promises of Christ\n\rLet us pray \n\rPour forth, we beseech Thee, O Lord,\n\rThy grace into our hearts; that we,  to whom the Incarnation of your Son has been made known by the  message of an Angel, may, by His passion and cross, be brought to the glory of His resurrection. Through Christ our Lord. Amen. \n\r"
	    },
	    {
	        "text": "Chaplet of Divine Mercy\n\r[object Object]\n\rEternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, our Lord Jesus Christ, in atonement for our sins and those of the whole world. \n\r (on each of the “Our Father” beads of a rosary)\n\rFor the sake of Your sorrowful passion, have mercy on us and on the whole world. \n\r(on each of the 10 “Hail Mary” beads)\n\rHoly God, Holy Mighty One, Holy Immortal One, have mercy on us, and on the whole world. O Blood and Water which gushed \n\rforth from t\n\rh\n\re\n\r Heart of Jesus as a fountain of Mercy for us, I trust in You. \n\r (3 times)\n\rJesus, I trust in you.\n\rIn the name of the Father, and of the Son, and of the Holy Spirit. Amen.\n\r"
	    },
	    {
	        "text": "Good Morning God!\n\rGood Morning God! You are ushering in another day, untouched and freshly new. So here I am to ask you, God, if you’ll renew me too. \n\rForgive the many errors that I made yesterday and let me try again dear God to walk closer in your way. \n\rBut Lord, I am well aware, I can’t make it on my own. So take my hand and hold it tight, for I cannot walk alone. \n\r"
	    },
	    {
	        "text": "Prayer Before A Crucifix\n\rLook down upon me, good and gentle Jesus, while before Your face I humbly kneel and, with burning soul, pray and beseech You to fix deep in my heart lively sentiments of faith, hope and charity; true contrition for my sins, and a firm purpose of amendment. \n\rWhile I contemplate, with great love and tender pity, Your five most precious wounds, pondering over them within me and calling to mind the words which David, Your prophet, said of Your, my Jesus: \n\r“They have pierced My hands and My feet, they have numbered all My bones.” \n\rAmen. \n\r"
	    },
	    {
	        "text": "Childhood Nighttime Prayers\n\rNow I lay me down to sleep\n\rI pray the Lord my soul to keep.\n\rIf I should die before I wake,\n\rI pray the Lord, my soul, to take.\n\rAmen.\n\rDear God, I thank you for your care\n\rYou’ve been right with me everywhere.\n\rAnd when the sun has said good-bye\n\rAnd little stars shine in the sky\n\rYou’re still with me not far above\n\rRight in my heart for you are love. Amen.\n\r"
	    },
	    {
	        "text": "Morning Offering\n\rO Jesus,\n\rthrough the Immaculate Heart of Mary,\n\rI offer You my prayers, works,\n\rjoys and sufferings\n\rof this day for all the intentions\n\rof Your Sacred Heart,\n\rin union with the Holy Sacrifice of the Mass\n\rthroughout the world,\n\rin reparation for my sins,\n\rfor the intentions of all my relatives and friends,\n\rand in particular\n\rfor the intentions of the Holy Father. \n\rAmen.\n\r"
	    },
	    {
	        "text": "Lectio Divina\n\rChoose a passage of scripture (around 10 verses is recommended – can be chosen at will, or a nice idea is to meditate on the next Sunday’s readings)\n\rAfter first read through, identify/say/meditate on one word or phrase that sticks out to you: like “Be still”  “follow” or “and they obeyed”.. anything that hits you.\n\rAfter second read through, identify another word or phrase that hits you, even if it ends up being the same as the first.  But, a new one is always nice.\n\rAfter the third read through, identify the overall theme, or the take-home message that you get from it.\n\rAfter the fourth read through, pray about the passage, bringing what you’ve learned to God and asking for help applying the lessons and meditations to your life.\n\r"
	    },
	    {
	        "text": "Guardian Angel Prayer\n\rAngel of God, My Guardian Dear\n\r to whom God’s love commits me here.\n\r Ever this day be at my side\n\r to light and guard and rule and guide.\n\rAmen. \n\r"
	    },
	    {
	        "text": "CHAPLET TO THE MOTHER OF THE MOST HOLY EUCHARIST\n\rHow to pray the Chaplet to the Mother of the Most Holy Eucharist\n\rThis devotion is prayed on the regular 59 beads Marian Rosary.\n\rYou begin by doing the “\n\r.”\n\rOn the first large bead, pray the “\n\r.”\n\rOn the next 3 small beads, pray 3 “\n\r.”\n\rOn the next large bead, pray:\n\r”My God, I love you with my whole heart,\n\rI repent of ever having offended You,\n\rnever permit me to offend You again,\n\rgrant that I may love You always,\n\rand then do with me what You will.\n\rAmen”\n\rBefore each decade, on the large bead, say the following prayer:\n\r”Hail Mary,\n\r0 Mother of the Most Holy Eucharist,\n\rhelp me to believe completely,\n\rhelp me to love completely,\n\rhelp me to live what I believe\n\rand love completely.”\n\rOn the 10 small beads, pray:\n\r”0 Mother help me!\n\rThen say the “\n\r.”\n\rConclude with:\n\r”Dearest Mother,\n\rI Believe, that Jesus Christ,\n\ryour Son is truly present\n\rin the Sacrament of the Most Holy Eucharist,\n\rBody, Blood, Soul and Divinity.\n\rI Believe, that He is the,\n\ronly begotten Son of God,\n\rWho became Man to save me, a sinner.\n\rBy partaking of this Most Holy Sacrament,\n\rI profess:\n\rThat I believe in the One,\n\rHoly, Catholic and Apostolic Church\n\rand that Her teachings and sacraments\n\rwere instituted by Christ.\n\rThat because this\n\ris truly His Precious Body\n\rand life giving Blood,\n\rto receive Him in the state of grace\n\rwill bring healing to both\n\rmy soul and body\n\rbut knowingly receive Him\n\rin the state of mortal sin\n\rwill bring me judgement and condemnation.\n\rDearest Virgin of Virgins,\n\rI declare these truths\n\rbefore You as my Witness,\n\rthat You who are the great Mother of God.\n\rMay you remember me before my Lord and Master,\n\rnow and at the hour of my death.\n\rAmen.”\n\r”0 Mother of the Most Holy Eucharist,\n\rPray for us.” (repeat three times)\n\r"
	    },
	    {
	        "text": "Thomas Merton Prayer\n\rMY LORD GOD, I have no idea where I am going. I do not see the road ahead of me. I cannot know for certain where it will end. Nor do I really know myself, and the fact that I think that I am following your will does not mean that I am actually doing so. But I believe that the desire to please you does in fact please you. And I hope I have that desire in all that I am doing. I hope that I will never do anything apart from that desire. And I know that if I do this you will lead me by the right road though I may know nothing about it. Therefore will I trust you always though I may seem to be lost and in the shadow of death. I will not fear, for you are ever with me, and you will never leave me to face my perils alone.\n\rAmen.\n\r"
	    },
	    {
	        "text": "Dear Saints Teach me....\n\rSt. Ann, teach me to love your daughter Mary\n\rHoly Mary, teach me to become more and more worthy of the promises of Christ\n\rSt. Joseph, teach me the virtue of silence\n\rSt. Daniel teach me wisdom\n\rSt. Michael teach me to conquer the devil\n\rSt. John the Baptist, teach me mortification\n\rSt. John the Beloved, teach me pure love of Jesus\n\rSt. Peter teach me fidelity\n\rSt. Paul teach me zeal for the salvation of souls\n\rSt. Thomas teach me to overcome doubt\n\rSt. Stephen, teach me the spirit of martyrdom\n\rSt. Simon of Cyrene, teach me love of the Cross\n\rSt. Veronica, teach me concern for the afflicted\n\rSt. Mary Magdalene, teach me repentance\n\rSt. Dismas (good thief) teach me how to “steal” Paradise\n\rSt. Agnes, teach me purity\n\rSt. Maria Goretti, teach me resistance to temptation\n\rSt. Jerome, teach me love of the Holy Scriptures\n\rSt. Monica, teach me steadfastness in prayer\n\rSt. Augustine, teach me respect for a mothers prayers\n\rSt. Francis Borgia, teach me to despise earthly vanities\n\rSt. Francis De Sales teach me always to smile\n\rSt. Francis of Assisi teach me humility\n\rSt. Francis Xavier, teach me zeal for the missions\n\rSt. Philip Neri, teach me cheerfulness\n\rSt. Thomas More, teach me to “keep my head”\n\rSt. Anthony teach me to “find” sanctity\n\rSt. Pascal, teach me love of the Holy Mass\n\rSt. John Vianney teach me respect for the holy priesthood\n\rSt. Thomas Aquinas, teach me love of divine contemplation\n\rSt. Albert the Great teach me love of heavenly wisdom\n\rSt. Vicent de Paul teach me love of the poor\n\rSt. Elizabeth teach me to break bread for the downtrodden\n\rSt. Camillus teach me to visit the sick\n\rSt. John Bosco teach me love of the Youth\n\rSt. Margaret Mary teach me love the Sacred Heart\n\rSt. Therese teach me the value of “little things” and how to do all for the honor and glory of God.\n\rAll you holy men and woman pray for us.....Amen\n\rJesus, I Trust in You! (In Praise of Divine Mercy) \n\rStrength at the altar,\n\rCourage from above\n\rWhen I’m ready to falter,\n\rYou reach out in love \n\rHold me to Your heart,\n\rWhen I’m weary and weak\n\rI don’t have the strength,\n\rBut You give what I seek \n\rPray to the Father,\n\rFollowing the Son\n\rShow me the Spirit,\n\rYou Three in One \n\rSee me kneeling.\n\rWretched as I am\n\rGraces from Heaven,\n\rBlessings from Your hand \n\rMother hold me close,\n\rAs I cry from the heart\n\rBrothers and sisters,\n\rHelp me stand apart \n\rCrying the soul’s tears,\n\r“To whom should I go?”\n\rYou reach out to hold me\n\rYou always seem to know\n\rThe solution to my struggle\n\rThe answer before I ask\n\rThe strength for what’s ahead\n\rThe courage that I lack \n\rHelp me to give my all\n\r& To cry out with truth\n\rThat though I fail alone\n\r“Jesus, I trust in You!” \n\rb\n\ry Mary Lovee Klipp\n\r[object Object]\n\r"
	    },
	    {
	        "text": "Lovely Lady Dressed in Blue\n\rLovely Lady dressed in blue\n\rTeach me how to pray!\n\rGod was just your little boy,\n\rTell me what to say!\n\rDid you lift Him up, sometimes,\n\rGently on your knee?\n\rDid you sing to Him the way\n\rMother does to me?\n\rDid you hold His hand at night?\n\rDid you ever try\n\rTelling stories of the world?\n\rO! And did He cry?\n\rDo you really think He cares\n\rIf I tell Him things-\n\rLittle things that happen? And\n\rDo the Angels’ wings\n\r   Make a noise? And can He hear\n\rMe if I speak\n\r real\n\r low?\n\rDoes He understand me now?\n\rTell me- for you know?\n\rLovely Lady dressed in blue-\n\rTeach me how to pray!\n\rGod was just your little boy,\n\rAnd you know the way.\n\r"
	    },
	    {
	        "text": "EXECUTION OF GOD’S WORD\n\rThe Word of God Says in Psalm 71:1\n\rIn you O Lord I take refuge, never\n\rlet me be put to shame.\n\rThe word of God says in Isaiah 57:14 & 15\n\rOpen up Open up and clear the way\n\rre\n\rm\n\rove all obstacles from the way of my people\n\rfor thus speaks the Most High\n\rwhose home is in Eternity\n\rWhose name is Holy.\n\rThe word of God says in Psalm 68:1 & 2\n\rLet God arise, Let his enemies be scattered\n\rLet those who hate him flee before him\n\rAs smoke disperses, they disperse\n\rAs wax melts when near the fire\n\rSo the wicked perish when God approaches.\n\rThe word of God says in Psalm 27:1\n\rThe Lord is my light and my salvation\n\rwhom shall I fear\n\rThe Lord is the stronghold of my life\n\rof whom shall I be afraid.\n\rThe word of God says in Amos 5:24\n\rLet justice surge like water\n\rand righteousness\n\rlike an unfailing stream.\n\rThe word of God says in Daniel 10:19\n\rDo not be afraid\n\rYou are a man specially chosen\n\rThe word of God says in 2 Chronicles 7:14\n\rThen if my people who bear my name\n\rHumble themselves and pray\n\rand seek my presence and turn\n\rfrom their wicked ways\n\rI myself will hear from heaven\n\rand forgive their sins.\n\rThe word of God says in Joel 2:17\n\rSpare your people,  Yahweh\n\rDo not make your heritage a thing of shame\n\ra byword for the nations\n\rWhy should it be said among the nations\n\rwhere is their God\n\rThe word of God says in Matthew 6:33\n\rSet your hearts on his Kingdom first\n\rAnd on his righteousness\n\rAnd all these other things will be\n\rgiven you as well.\n\rThe word of God says in Matthew 7:8 & 9\n\rAsk and it will be given you\n\rSearch and you will find\n\rKnock and the door will be opened to you\n\rFor the one who asks always receives\n\rThe one who searches always finds\n\rThe one who knocks always\n\rhas the door opened to him.\n\r"
	    },
	    {
	        "text": "The Memorare\n\rRemember, O Most Gracious Virgin Mary,\n\rthat never was it known that anyone who fled to Thy protection,\n\rimplored Thy help or sought Thine intercession,\n\rwas left unaided.\n\rInspired by this confidence,\n\rI fly unto Thee, O Virgin of Virgins, my Mother;\n\rto Thee do I come, before thee I stand, sinful and sorrowful.\n\rO Mother of the Word Incarnate,\n\rdespise not my petitions,\n\rbut in Thy mercy, hear and answer me.\n\rAmen.\n\r"
	    },
	    {
	        "text": "St Michael the Archangel Prayer\n\rSt. Michael the Archangel, defend us in battle.\n\rBe our protection against the wickedness and snares of the devil.\n\rMay God rebuke him, we humbly pray.\n\rAnd do you, O prince of the Heavenly Host,\n\rBy the power of God\n\rCast into Hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls.\n\rAmen.\n\r"
	    }
	];


    db.collection('prayers', function(err, collection) {
        collection.insert(prayers, {safe:true}, function(err, result) {});
    });

};