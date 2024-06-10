import { Typography, Grid } from '@mui/material';

const Thingstoknow = () => {
  return (
    <section>
      <Typography variant="h4" gutterBottom>Things To Know About</Typography>
      <Typography variant="h5" gutterBottom>About</Typography>
      <Typography variant="body1" paragraph>
        ITC Gardenia is a renowned venue located in Bangalore`&#39;`s most prestigious and plush neighborhood. It has hosted some of the most luxurious and sophisticated weddings over the years. The hotel has a team of personnel who are eager to help you with all your wedding requirements throughout.
      </Typography>
      <Typography variant="h5" gutterBottom>Approach</Typography>
      <Typography variant="body1" paragraph>
        ITC Gardenia, the extremely dreamy property to host your lavish wedding, is located on Residency Road in Ashok Nagar, Bengaluru, and is well equipped with facilities that redefine comfort with elegance and efficiency. It is an easily accessible venue.
      </Typography>
      <Typography variant="h5" gutterBottom>Ambience</Typography>
      <Typography variant="body1" paragraph>
        Vintage or Rustic, Contemporary or classic, you name a theme and ITC Gardenia, the best wedding hotel in Bangalore, would always go the extra mile to make your theme an extravagant and special one. This 5-star hotel provides extraordinary services and leaves no stone unturned to make your wedding a beautiful one. Words fall short to describe its elegance. Each and Every Banquet hall gives out its own charm in an inimitable way. The beauty of the place is flawless and unblemished.
      </Typography>
      <Typography variant="h5" gutterBottom>Food and Service</Typography>
      <Typography variant="body1" paragraph>
        The hotel has a team of professional staff who will offer high-quality services and exemplary hospitality solutions for you and all your guests for a flawless event. Some of the services they offer are in-house catering options so that your event is blessed with an array of multi-cuisine platters that are of top-notch quality and comfortable quantity. They also permit you to hire external decorators in case one wants to hire a decorator of their choice and suit their custom needs.
      </Typography>
      <Typography variant="h5" gutterBottom>Known For</Typography>
      <Typography variant="body1" paragraph>
        Everyone has a movie-kind-of-wedding fantasy, where there are huge chandeliers and elegant wine glasses, satin drapes on the chairs, humongous spaces, regal wood doors, smooth carpet sheets, a fragrance floral fiesta, and everything that just stands apart from all other weddings. Given a chance they can provide you with the most exotic choices to make your dream wedding celebration come true.
      </Typography>
      <Typography variant="h5" gutterBottom>Best suited for</Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={6} sm={3}>
          <Typography variant="body1" align="center">Anniversary</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body1" align="center">Birthday Party</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body1" align="center">Cocktail Party</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body1" align="center">Conference</Typography>
        </Grid>
      </Grid>
      <Typography variant="body1" paragraph>
        <a href="#">Read More</a>
      </Typography>
      <Typography variant="h5" gutterBottom>Amenities</Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={6} sm={3}>
          <Typography variant="body1" align="center">Catering</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body1" align="center">DJ Available</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body1" align="center">Parking</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body1" align="center">A/V Equipment</Typography>
        </Grid>
      </Grid>
      <Typography variant="body1" paragraph>
        <a href="#">Read More</a>
      </Typography>
      <Typography variant="h5" gutterBottom>Cuisines</Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={6} sm={3}>
          <Typography variant="body1" align="center">European</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body1" align="center">Japanese</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body1" align="center">Italian</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body1" align="center">Indian</Typography>
        </Grid>
      </Grid>
      <Typography variant="h5" gutterBottom>Terms and Conditions</Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" align="center">All Government applicable taxes will be applied.</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" align="center">All Venue Rules Apply.</Typography>
        </Grid>
      </Grid>
      <Typography variant="h5" gutterBottom>Parking</Typography>
      <Typography variant="body1" paragraph>
        Parking space available for vehicles.
      </Typography>
    </section>
  );
};

export default Thingstoknow;
