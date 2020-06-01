**ReadMe Submission for Orbital 2020**

**Milestone #1**

**Li Xupeng (A0201614X); Donavan Lim (A0206088A)**

** **

**Team Name:**

_trippyy_

**Proposed Level of Achievement:**

  

Artemis

**Motivation**

 

When one travels for a vacation, the options available for planning his travels are usually limited to the following: to either follow through with a planned itinerary from a travel agency, or to research and plan an itinerary out from scratch.

 

In the process of planning for an itinerary, travellers are **often met with hassles**. These include having to take into consideration the following: travel costs (travel budget), modes of travel, the multiple locations of their intended sites to visit and accommodation, and ensuring that their time spent is maximised and not wasted on unnecessary activities such as route-detours.

 

Therefore, we are inspired to **build a user-friendly platform** where travellers can plan their trip with the activities they desire to do, while **skipping the hassles of dealing with the nitty-gritty details**, which would be** dealt with by the algorithms in our platform.**

 



**Aim**

 

We aim to:



*   Integrate algorithms that automatically suggest convenient and well-thought-out itineraries which are practical in terms of geo-convenience, time, and costs. 
*   Build programmes that seamlessly generate an itinerary based on minimal input provided by the user.
*   Incorporate an aesthetic and purposeful user interface for users to view their itinerary, and conveniently make further adjustments/customisation of their final itinerary if desired.

**User Stories**



1. Travellers who wish to **build** their itinerary with either activities that are (i) **keyed-in manually**; or (ii) **auto-generated from our drop-down list/drop-pins on map**, can rely on our algorithm to optimise for an itinerary that presents a logical flow of activities (e.g. low costs, minimal travelling distance…).
2. Travellers who wish to **share** their itinerary with their fellow travellers can do so using _trippyy_, where travellers can collaborate and customise activities easily from the neat user interface.
3. Travellers who wish to **get a quick gauge of their trip expenditure** can do so from looking at the tabulation of costs in the optimised itinerary generated, and further customise their trip to suit their budget afterwards.

**Competitor Analysis**


    Currently, most major travel applications are focused on providing accommodation or airline solutions for their users, and are not focused on providing automated itineraries. There are however several trip-planning applications which aim to automate and ease the process of trip-planning. Below are some major players.



1. **TripAdvisor** - Whilst TripAdvisor is a great platform for reading reviews, the trip-planning branch of the application only allows you to add and keep track of locations in your trip. The planning of the trip with regards to considering practical factors still has to be done manually.
2. **Inspirock** - Inspirock is a similar platform in which it aims to fully automate trip-planning, and allow customization. Inspirock provides users with a generic itinerary, and subsequently allows for changes. However, this would lead to all users getting mostly generic itineraries, which is in contrast with what we are setting out to do, where the user remains in full control of what activities and attractions he/she wants to do/visit.
3. **Funliday**- Funliday allows you to key-in activities which you want to do, and would automate to show you the travelling times needed to move between locations. It then allows you to shift activity blocks around to re-calculate travelling time. However, cost is not taken into consideration and Funliday still requires a manual process where users would manually shift activity blocks around in order to find the most time-efficient itinerary for their trip.
4. **TripIt** - TripIt offers free conversion of documented itineraries into an original app format that allows for live tracking, customisation and updates for users during their trips, where travellers can view a shared itinerary plan. However, every activity and its details needs to be manually input by the user themselves (with no autocompletion) should they not have an itinerary already done up. While this offers full customisation for the users, it remains as basic as planning on any collaborative document.
5. **Expedia** - A majorly-established travel application. Expedia,  however, does not provide automated trip-planning solutions, but specific deals pertaining to hotel, flight, cruise and car rental bookings.
6. **Manual planning** - Given that average users who do not use any trip-planning services would likely plan their trips using any data-organisation platform such as Excel, they would do the following:
1. Manually chart out the travelling time, ensuring that they visit attractions that are close to each other on the same day such that no detours are made.
2. Consider their budget, and calculate the total cost of their trip to ensure that it is within budget.
3. Check for travelling routes and their possible alternatives.
4. Check for other miscellaneous factors, such as opening hours and weather conditions for outdoor activities.

In summary, the itinerary auto-curation scene remains rather untapped amidst services whose nature are of manual itinerary planning (i.e. hotel bookings). We aim to explore and develop itinerary auto-curation by piecing together the best features currently implemented in the market. Not only do we believe that improving upon these features would make _trippyy _stand out from its own originality, we believe that these improvements are pivotal in defining how a traveller’s experience should be.


                


                **Features and Timeline**

 

**<span style="text-decoration:underline;">Features</span>**

Under the scope of Orbital, a travel **website interface **hosting the application for users to interact with would be developed, and we would focus on planning itineraries for one city per trip only (i.e. Cross-city trips are not supported). Refer to Diagram 1 for the illustrated user flow of _trippyy_:

**<span style="text-decoration:underline;">Diagram 1. A simplified illustration of the user flow of _trippyy_.</span>**

The flow will be subdivided into 3 phases:



1. Input Phase
2. Shopping Phase
3. Results Phase



**<span style="text-decoration:underline;">Phase 1: Input Phase:</span>**



<p id="gdcalert1" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image1.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert2">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image1.png "image_tooltip")


**<span style="text-decoration:underline;">Diagram 2. A rough draft of inputting location of travel, and number of days</span>**

Travellers start off by conveniently inputting the following into the platform: 



*   Location of travel (refer to Diagram 2);
*   Number of days of travel (refer to Diagram 2);
*   Location of pre-arranged accommodation; (if available)

    The user is then offered two options: 


    1. To select his/her activities for the itinerary of his/her trip


        2. To let the algorithm automatically select activities and generate their itinerary subsequently.


**<span style="text-decoration:underline;">Diagram 3. Sample Aesthetic Design (to be improved on)</span>**

This concludes the initial stage of inputs by the user, and the user can now proceed to generate his/her optimised itinerary via Phase 2, the Shopping Phase.

**<span style="text-decoration:underline;">Phase 2: Shopping Phase:</span>**

**<span style="text-decoration:underline;">Diagram 4. A draft layout of the Shopping Phase.</span>**

*This is a rough draft to showcase functionality, **design would be largely improved upon**

******Aspect ratio of the above concept is not to scale

***A search option would be included as well, which is not reflected above.

Above illustrates the Shopping Phase page, which would be divided into 3 sections in vertical columns:



*   Details Column
*   List Column
*   Map Column

(more of their functionalities explained later)



**<span style="text-decoration:underline;">2 UI Modes for Shopping Phase:</span>**

Upon inputting the required fields in the Input Phase, the user is then taken to the Shopping Phase to selects his/her activities for their trip itinerary. This will be done in 2 modes (see Diagram 5):


    Mode 1: List-centric Focus


    Mode 2: Geographic-centric Focus

**<span style="text-decoration:underline;">Rationale for 2 Modes (a UI/UX perspective):</span>**

The rationale for implementing 2 differing modes to select activities to populate their itinerary would stem from the UI/UX benefits that each mode offers over the other when choosing their activities.

A list-centric focus (Mode 1) would allow the user to see at a glance, the list of activities at their respective locations available to them in a tiled-format across the screen. Users would only have to **focus their attention on the nature of activities they wish to participate in **via filters that filter activities by categories** and not on their locations **(see details)**. **This mode is catered for users who wish for their itinerary to be **filled with activities that best suit their personality/interests/character. **

A geographic-centric focus (Mode 2) on the other hand would** place the emphasis on the location of the activities** that the user would like to select for his/her itinerary. Users would be allowed to select their activities from the map itself through drop-pins dotted across the map, and thus **see at a glance their destinations around the region **they are travelling to.** **This mode is catered for users who wish for their itinerary to be **filled with activities that are in close proximity/would not require unfavourable travelling time over long distances.**

**<span style="text-decoration:underline;">Diagram 5.</span>**


**<span style="text-decoration:underline;"> A draft illustrating the layout of the Columns of the Shopping Page of Model 1 (Right), and Model 2 (Left)</span>**



**<span style="text-decoration:underline;">Details of Mode 1 and Mode 2 of Shopping Phase:</span>**



*   A list of popular activities/food locations would be recommended to the user, organised in a tile-like layout that can be segregated by filters. These will all be shown in the central column of the webpage (Refer to Diagram 6).

**<span style="text-decoration:underline;">Diagram 6. A draft illustrating a list of activities shown in a tile-like layout.</span>**



*   This would be done using data from Google Places API/Sygic Travel API, in which filtered top-rated tourist activities and food locations would be returned.

    For example: 

1. Sight-seeing
1. Singapore Zoo
2. Art Science Museum
3. …
2. Shopping
1. Bugis Street
2. Marina Bay Sands
3. ...
3. Food 
    1. Chomp Chomp Food Centre
    2. Whampoa Food Market
    3. ... 

            

*   The user would then select a list of items he/she would like to do in their trip from the list, or have the option to add his/her own activities through a search function. 

	<span style="text-decoration:underline;">Mode 1:</span>



*   In Mode 1, the List Column will take up the equal real estate of the webpage as the other columns would, at the centre. While the focus would be on the users picking activities without needing to be concerned of their locations, a map column still coexists on the right side of the webpage.
*   The Map Column will be auto-populated with drop-pins of the activities’ locations as the user goes about selecting his/her activities from the list.
*   The Details Column will also be auto-populated with data and necessary details such as total expenses, total hours remaining to be filled with activities selection, list of activities selected so far etc., as the user goes about selecting his/her activities from the list.

	<span style="text-decoration:underline;">Mode 2:</span>



*   In Mode 2, the List Column will not exist, and the Map Column will instead fill up the majority of the screen real estate of the webpage. In this mode, users will select their activities from the drop-pins of recommended activities on the map.
*   The Details Column will likewise be auto-populated similarly to Mode 1.

**<span style="text-decoration:underline;">Platform’s Itinerary Output:</span>**



*   The platform registers the aforementioned inputs, and returns an auto-generated itinerary that is optimised based on the users' input. 
*   The auto-curation engine would first auto-curate according to the user’s needs, followed by optimising the itinerary to be the most cost and time-efficient by factoring several key factors such as geolocation, travel costs from different travel options, etc. This results in an itinerary that is both cost and time-efficient.
*   A vertical layout of the itinerary is auto-generated and built live as the user selects activities for his/her itinerary. This would be embedded in the Details Column of the webpage (Refer to Diagram 7 for an example).
*   _Note that a horizontal layout of the itinerary will also be generated, but this will only be shown in the Results Phase, where the screen real estate is freed up from the disappearance of the Map Column since the user would not need to select activities anymore. The horizontal layout of the itinerary is shown in the Results Phase (Refer to Diagram 8 for an example)._



<p id="gdcalert2" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image2.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert3">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image2.png "image_tooltip")
** **

**<span style="text-decoration:underline;">Diagram 7. A rough draft of an output itinerary (vertical layout)</span>**

*This is a rough draft to showcase functionality,** design would be largely improved upon.**

**This is only the summary portion of the output, a detailed day-to-day itinerary has not been reflected.

**<span style="text-decoration:underline;">Phase 3: Results Phase:</span>**

**<span style="text-decoration:underline;">Diagram 8. A rough draft of an output itinerary (horizontal layout)</span>**

*This is a rough draft to showcase functionality,** design would be largely improved upon.**

**This is only the summary portion of the output, a detailed day-to-day itinerary has not been reflected.

The Results Phase would consist of primarily of 2 main segments:



*   Details Column
*   Horizontal Itinerary Layout

The Details Column would resemble the same Details sidebar as seen in the Shopping Phase, displaying similar details.

The Horizontal Itinerary Layout will consist of blocks that would allow to be sectioned according to the time span for each activity, across days of the week that the user would be travelling on. 

This is designed primarily for the following few reasons: a horizontal layout spanning across days puts emphasis on the timespan of each activity, which will allow for users to appreciate/get a sense for the level of activity to be done on each day, and across the timespan of their trip. Moreover, users can easily customise their itinerary by shifting block of activities around according to their preference, one of which includes the addition of premeditated activities into their itinerary (_see section on Further Info below_). 


```
Diagram 9. A rough draft of the webpage in the Results Phase.
```


In addition, options for sharing the itinerary will be made available in the section below of the Horizontal Itinerary Layout. This would allow users to share their itinerary via hyperlinks which the public can access to to view the itinerary. Alternatively, the user can export/download the horizontal itinerary as a PDF/PNG file in which they can share by their own means afterwards.



**<span style="text-decoration:underline;">Additional User Input:</span>**

After the auto-generation of the itinerary, travellers can optionally do the following:

(With each change, the itinerary may tweak and return a new itinerary to re-optimise cost and time)



*   **Rearrange and Customise**
    *   Suggested Activities; and
    *   Suggested Modes of Transportation.

Users would be able to easily click and drag any selected activity into a different time slot, in which the algorithm would then re-optimise the itinerary (in the event that users want to visit an attraction at a specific date and time).



*   **Add premeditated custom activities into the itinerary:**
    *   Add the location and time of the pre-planned activity. This gives users the option to allow the algorithm to reorganise the itinerary in a way that brings the most geo-convenience to the user; and
    *   Add the cost of the activity, which factors in total cost.

**<span style="text-decoration:underline;">Further information on the intended functionality of the algorithm and platform:</span>**

 

**1. Number of Days criteria:** For both Option 1 and 2,** **based on the number of days input by the user, a certain number of activities would be suggested to him/her. This will be calculated by factoring in average durations for these activities onto the total duration of the trip (which will be provided by Google Places API).

For example:


    Number of days: 3 days 2 nights


    => Number of activities suggested: 2 sightseeing activities, 8 food places, and 4 shopping places.

**2. Fixed Activities criteria:**Users can also construct/customise their itinerary that takes into consideration several fixed location and timings for certain events they have in mind (the algorithm builds around these criteria). This is done after the itinerary is generated in the Results Phase.

**3. Customisation of Modes of Transport (‘Upgrade’ option):**The default itinerary returned would use the cheapest transport option in its cost-tabulation. However, for longer trips, an alternative ‘upgrade’ option would be made available to the user. (This is done with the help of Google Places API.) This option would be higher in transport costs, but would save a significant amount of time (e.g. travelling via a Taxi, Bullet Train in Japan instead), and an optimised itinerary would be built around the ‘upgraded’ option as well.

The ‘upgrade’ option would also show how much the increase in cost would be and how much time they would be able to save, in comparison to the original mode of transport that minimises travel costs with longer transport time. This would enable the user to visually & more easily decide on which option he/she would want to use for their trip. Users can switch to either option at any time, and the itinerary would be adjusted accordingly.

**4. Enhanced User Interaction:** Once the itinerary is auto-generated, the user can view the itinerary at a glance across a user-friendly horizontal/vertical timetable, where blocks of activities can be rearranged according to their preference. 

**5. Collaboration:**Users can download a picture of their itinerary, and obtain a unique sharing link that can be shared with others for others to view the itinerary online,



**<span style="text-decoration:underline;">Future enhancements:</span>**

This section discusses future plans and developments for _trippyy_. There are functionalities that could be added in order to enhance the user’s experience when using _trippyy,_ effectively allowing the user to put in less effort in planning for their trip. These are illustrated in the following:



1. _trippyy_, which is a travel web application, should ideally be implemented as an application for iOS and Android too.
2. Add the extension of importing/exporting itineraries into common formats such as Excel, or PDF.
3. Add features that respond to real-time data such as user’s location and weather. These could include recommendations of other nearby indoor activities should rainy weather be predicted.
4. Improve upon the nature of the activities recommended to the user through machine learning.
5. Features pertaining to itinerary collaboration can be enhanced, such as tracking changes made to the itinerary and saving versions of it.

Additionally, _trippyy_ has the potential to be <span style="text-decoration:underline;">deeply connected with the travel and tourism industry</span>. These future plans for integration and commercialisation are illustrated below:



6. Add the option to allow users to purchase travel essentials, such as data SIM cards, travel passes and attraction tickets through _trippyy_ via a package.
7. Add the option to allow users to book their flights and accommodation through _trippyy_ (e.g. pulling listings from Expedia, Trivago, Booking.com, instead of referral links to these sites).

We also considered several future <span style="text-decoration:underline;">marketing strategies</span> that could propel_ trippyy_’s service into the industry, these are illustrated as such:



8. For Marketing and Scaling, one potential route we could take would be Influencer Marketing. Our advertisers could be Youtubers who are travel hobbyists/vloggers, or Popular Instagram micro-influencers in the niche of travel/wanderlust/camping etc. 
    1. Instagram micro-influencers could solely market trippyy to their audiences who could use our service that will be affiliated with other services such as accommodation services.
    2. A more intricate model could involve the participation of tourist attractions as well.  Proper reviews of attractions by these influencers could be done as part of our marketing strategy for_ trippyy_. Influencers that agree to review certain attractions would publish their genuine reviews to their YouTube channels, and leave a link in their description where viewers who are interested in visiting the attraction can plan for their visit using _trippyy_.  **In essence, tourist attractions essentially pay _trippyy_ for increased publicity and reception, and _trippyy_ pays influencers for reviews of these attractions.** In the long run, if this marketing strategy is successful, greater collaborations involving more tourist attractions themselves could sustain this marketing strategy financially, and _trippyy_ gains sustained usage from users.
9. Upon the launch of _trippyy_, one of our bottlenecks would be a lack of awareness of_ trippyy_’s services. Thus, as one of our target audiences include young adults who spend a lot of time on Instagram, we also plan to use Instagram filter games as a marketing strategy, since the usage of Instagram filters tends to gain traction swiftly among Instagram users, and increase the awareness of_ trippyy_’s platform. Filters could include unique games where the user with the highest score would win a prize, or simply interactive filters that would warrant participation.

**<span style="text-decoration:underline;">Timeline</span>**

For this project, we would have two main pillars to develop: the web interface for the application, and the algorithm of the application.

We aim to come up with a functional web application by the end of Orbital, and to launch the full application with extensions by the end of the year as we expect there would be a significant spike in tourist activities when the COVID-19 situation improves, and where travel restrictions are gradually loosened.

**Under the scope of Orbital, the following features are to be completed by:**

<span style="text-decoration:underline;">the end of May:</span>



1. <span style="text-decoration:underline;">Week 1</span>

    **General:**Learn more about technologies required for the project.

2. <span style="text-decoration:underline;">Week 2</span>

    **General:**Finalize ideas and technologies to use for the project, come up with an updated proposal, poster and video.

3. <span style="text-decoration:underline;">Week 3</span>

    **Web interface:**Basic web interface of a layout page, including a navigation bar and a simple design.

4. <span style="text-decoration:underline;">Week 4</span>

    **Web interface:** Implementation of Google Places API/Sygic Travel API to generate recommended activities based on the city of the trip. Basic web interface to display recommended activities and obtain inputs from the user. Working back-end database.


 

<span style="text-decoration:underline;">the end of June:</span>



5. <span style="text-decoration:underline;">Week 1</span>

    **Web interface:** Implementation of a search bar and filters for recommended activities. Allow for the input of custom user-created activities.

6. <span style="text-decoration:underline;">Week 2</span>

    **Algorithm:** To develop a basic algorithm to return a time-efficient itinerary. 

7. <span style="text-decoration:underline;">Week 3</span>

    **Web interface:**Basic web interface to display results generated from the algorithm.


    **Algorithm:**To develop an algorithm to update and recalibrate the itinerary when any updates are made from the ‘Results’ page.

8. <span style="text-decoration:underline;">Week 4</span>

    **Web interface:**Update web interface to update the ‘Results’ page to reflect recalibrated itinerary upon any changes are made. Add a basic design to the website.


    **Algorithm:**Optimise algorithms.




<span style="text-decoration:underline;">the end of July:</span>



9. <span style="text-decoration:underline;">Week 1</span>

    **Algorithm:**Algorithm testing, and further optimization of algorithms.

10. <span style="text-decoration:underline;">Week 2</span>

    **Algorithm:**Algorithm to auto-select activities to be included in the itinerary based on length of the trip.


    **Web interface:**Add extension of having the option to auto-select activities to be included in the itinerary. 

11. <span style="text-decoration:underline;">Week 3</span>

    **Algorithm:**Further testing and optimization.


    **Web interface:
    **Further design improvements

12. <span style="text-decoration:underline;">Week 4</span>

    Finalize design and algorithms.


**Tech Stack**

**Front-end**

1. HTML/CSS/Bootstrap

2. JavaScript

3. ReactJS

4. Redux (React-Redux)

**Back-end**

5. Django-REST API

6. PostgreSQL

7. Google Places API

8. Sygic Travels API

**Version Control**

9. Git

10. Travis CI

 



**Project Log:**

**Additional Information on _trippyy_**

Poster: https://i.imgur.com/e4NAmWJ.png

Video: https://youtu.be/QrqgEPEkC4E

Development Site: 

**<span style="text-decoration:underline;">About us:</span>**

Donavan Lim: [https://www.linkedin.com/in/donavan-lim/](https://www.linkedin.com/in/donavan-lim/)

Li Xupeng: [https://www.linkedin.com/in/lixupeng/](https://www.linkedin.com/in/lixupeng/)
